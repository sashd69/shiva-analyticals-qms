import { generateUuidV4 } from '../utils/uuid';
import { User, UserRole, Department } from '../types';
import { clearAllData } from '../utils/localStorage';

// Mock users for local authentication
const mockUsers = [
  {
    id: '1',
    email: 'admin@shivaanalyticals.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    department: 'Food and agriculture',
    departmentId: '1'
  },
  {
    id: '2',
    email: 'sales@shivaanalyticals.com',
    password: 'password123',
    firstName: 'Sales',
    lastName: 'Representative',
    role: 'sales' as UserRole,
    department: 'Ores and minerals',
    departmentId: '2'
  },
  {
    id: '3',
    email: 'support@shivaanalyticals.com',
    password: 'password123',
    firstName: 'Support',
    lastName: 'Specialist',
    role: 'support' as UserRole,
    department: 'Environmental',
    departmentId: '4'
  },
  {
    id: '4',
    email: 'management@shivaanalyticals.com',
    password: 'password123',
    firstName: 'Management',
    lastName: 'Director',
    role: 'management' as UserRole,
    department: 'Pharmaceutical',
    departmentId: '5'
  },
  {
    id: '5',
    email: 'demo@user.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'sales' as UserRole,
    department: 'Food and agriculture',
    departmentId: '1'
  },
  {
    id: '5',
    email: 'demo@user.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'sales' as UserRole,
    department: 'Food and agriculture',
    departmentId: '1'
  }
];

// Mock departments
const mockDepartments = [
  {
    id: '1',
    name: 'Food and agriculture',
    description: 'Agricultural and food safety testing services',
    head: 'Dr. Sarah Johnson',
    budget: 500000,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Ores and minerals',
    description: 'Geological and mineral analysis laboratory',
    head: 'Dr. Michael Chen',
    budget: 750000,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Materials',
    description: 'Materials science and engineering testing',
    head: 'Dr. David Rodriguez',
    budget: 600000,
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Environmental',
    description: 'Environmental monitoring and analysis',
    head: 'Dr. Emma Wilson',
    budget: 550000,
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    name: 'Pharmaceutical',
    description: 'Pharmaceutical and biomedical testing',
    head: 'Dr. Lisa Anderson',
    budget: 800000,
    isActive: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

// Local storage keys
const AUTH_TOKEN_KEY = 'analytica_auth_token';
const AUTH_USER_KEY = 'analytica_auth_user';

// Local authentication service
export const localAuth = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    // Find user by email
    console.log('Attempting login with:', email);
    console.log('Available users:', mockUsers.map(u => u.email));
    
    // Find user by email (case insensitive)
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      console.error('Login failed: Invalid email or password');
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Create session token
    const token = generateUuidV4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes
    
    // Create user object
    const userObj: User = {
      id: user.id,
      username: user.email.split('@')[0],
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      departmentId: user.departmentId,
      isActive: true,
      createdAt: new Date().toISOString(),
      permissions: [],
      isFirstLogin: false
    };
    
    // Store in local storage
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({
      token,
      expiresAt: expiresAt.toISOString()
    }));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
    
    // Update last login timestamp
    userObj.lastLogin = new Date().toISOString();
    
    return { success: true, user: userObj, token };
  },
  
  // Sign out
  async signOut() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    // Clear all application data when signing out
    clearAllData();
    return { success: true };
  },
  
  // Get current user
  async getCurrentUser() {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!userJson) return null;
    
    try {
      const user = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  // Check if session is valid
  async checkSession() {
    const tokenJson = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!tokenJson) return false;
    
    try {
      const { expiresAt } = JSON.parse(tokenJson);
      return new Date(expiresAt) > new Date();
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  },
  
  // Extend session
  async extendSession() {
    const tokenJson = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!tokenJson) return false;
    
    try {
      const { token } = JSON.parse(tokenJson);
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes
      
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({
        token,
        expiresAt: expiresAt.toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  },
  
  // Get departments
  async getDepartments(): Promise<Department[]> {
    return mockDepartments;
  },
  
  // Set user department
  async setUserDepartment(departmentId: string, departmentName: string) {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!userJson) return false;
    
    try {
      const user = JSON.parse(userJson);
      user.departmentId = departmentId;
      user.department = departmentName;
      user.isFirstLogin = false;
      
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error setting department:', error);
      return false;
    }
  }
};