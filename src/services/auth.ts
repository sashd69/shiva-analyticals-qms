import { supabase } from '../lib/supabase';
import { logAuditEvent } from '../lib/supabase';
import { User, UserRole } from '../types';
import bcrypt from 'bcryptjs';

// Authentication service functions
export const signIn = async (email: string, password: string) => {
  try {
    // Real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, departments:department_id(id, name)')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    // Check if user is trying to access a department they're not assigned to
    if (profile.department_id) {
      // Log successful login
      await supabase.from('login_history').insert({
        user_id: profile.id,
        ip_address: '127.0.0.1', // In a real app, you'd get the actual IP
        user_agent: navigator.userAgent,
        success: true,
        department: profile.departments?.name || null
      });
    }
    
    const userProfile: User = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role as UserRole,
      department: profile.departments?.name || '',
      departmentId: profile.department_id,
      isActive: profile.is_active,
      lastLogin: profile.last_login,
      createdAt: profile.created_at,
      permissions: [],
      isFirstLogin: profile.department_id === null
    };
    
    // Update last login timestamp
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', profile.id);
    
    await logAuditEvent('USER_LOGIN', 'Auth', { email: profile.email });
    
    return { user: userProfile, session: data.session };
  } catch (error) {
    console.error('Sign-in error:', error);
    
    // Log failed login attempt
    try {
      const { data: userByEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userByEmail) {
        await supabase.from('login_history').insert({
          user_id: userByEmail.id,
          ip_address: '127.0.0.1', // In a real app, you'd get the actual IP
          user_agent: navigator.userAgent,
          success: false,
          department: null
        });
      }
    } catch (logError) {
      console.error('Error logging failed login:', logError);
    }
    
    throw error;
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    await logAuditEvent('USER_LOGOUT', 'Auth');
    return true;
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, departments:department_id(id, name)')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      const userProfile: User = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role as UserRole,
        department: profile.departments?.name || '',
        departmentId: profile.department_id,
        isActive: profile.is_active,
        lastLogin: profile.last_login,
        createdAt: profile.created_at,
        permissions: [],
        isFirstLogin: profile.department_id === null
      };
      
      return userProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

export const subscribeToAuthChanges = (
  callback: (event: string, session: any) => void
) => {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => {
    data.subscription.unsubscribe();
  };
};

export const setUserDepartment = async (userId: string, departmentId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ department_id: departmentId })
      .eq('id', userId);
    
    if (error) throw error;
    
    await logAuditEvent('DEPARTMENT_ASSIGNED', 'Auth', { userId, departmentId });
    return true;
  } catch (error) {
    console.error('Error setting department:', error);
    throw error;
  }
};

export const createUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}) => {
  try {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        }
      }
    });
    
    if (error) throw error;
    
    await logAuditEvent('USER_CREATED', 'Auth', { email: userData.email, role: userData.role });
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getLoginHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching login history:', error);
    return [];
  }
};