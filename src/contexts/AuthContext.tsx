import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { localAuth } from '../lib/localAuth';
import { User, UserRole, Department } from '../types';
import DepartmentSelector from '../components/Auth/DepartmentSelector';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
  isFirstLogin: boolean;
  isLoading: boolean;
  selectedDepartment: string | null;
  requireDepartmentSelection: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; isFirstLogin: boolean } }
  | { type: 'LOGOUT' }
  | { type: 'EXTEND_SESSION' }
  | { type: 'SESSION_EXPIRED' }
  | { type: 'SET_DEPARTMENT'; payload: { departmentId: string; department: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SELECT_DEPARTMENT'; payload: string }
  | { type: 'REQUIRE_DEPARTMENT_SELECTION'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
      const requireSelection = action.payload.user.role === 'sales' || 
                              action.payload.user.role === 'support';
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        sessionExpiry,
        isFirstLogin: action.payload.isFirstLogin,
        isLoading: false,
        selectedDepartment: null,
        requireDepartmentSelection: requireSelection
      };
    case 'EXTEND_SESSION':
      return {
        ...state,
        sessionExpiry: Date.now() + (30 * 60 * 1000)
      };
    case 'SET_DEPARTMENT':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          departmentId: action.payload.departmentId,
          department: action.payload.department,
          isFirstLogin: false
        } : null,
        isFirstLogin: false,
        isLoading: false,
        requireDepartmentSelection: false
      };
    case 'SELECT_DEPARTMENT':
      return {
        ...state,
        selectedDepartment: action.payload
      };
    case 'REQUIRE_DEPARTMENT_SELECTION':
      return {
        ...state,
        requireDepartmentSelection: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        sessionExpiry: null,
        isFirstLogin: false,
        isLoading: false,
        selectedDepartment: null,
        requireDepartmentSelection: false
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => boolean;
  extendSession: () => void;
  setUserDepartment: (departmentId: string, department: string) => Promise<void>;
  requireDepartmentSelection: () => void;
  getDepartments: () => Promise<Department[]>;
  selectDepartment: (departmentId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    sessionExpiry: null,
    isFirstLogin: false,
    isLoading: true,
    selectedDepartment: null,
    requireDepartmentSelection: false
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const isSessionValid = await localAuth.checkSession();
      
      if (isSessionValid) {
        try {
          const userData = await localAuth.getCurrentUser();
          if (!userData) return;
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { 
              user: userData,
              token: 'local-auth-token',
              isFirstLogin: userData.isFirstLogin || false
            }
          });
        } catch (error) {
          console.error('Error retrieving user:', error);
           dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // No auth state change listener needed for local auth
  }, []);

  useEffect(() => {
    // Session timeout check
    if (state.sessionExpiry) {
      const timer = setTimeout(() => {
        if (Date.now() >= state.sessionExpiry!) {
          dispatch({ type: 'SESSION_EXPIRED' });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.sessionExpiry]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('AuthContext: Attempting login with:', email);
      const { success, user, token, error } = await localAuth.signIn(email, password);
      
      if (!success || !user) {
        console.error('AuthContext: Login failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
      
      console.log('AuthContext: Login successful for user:', user.email);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: token || 'local-auth-token',
          isFirstLogin: user.isFirstLogin || false
        }
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await localAuth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkSession = (): boolean => {
    if (!state.sessionExpiry) return false;
    return Date.now() < state.sessionExpiry;
  };

  const extendSession = () => {
    if (state.isAuthenticated) {
      dispatch({ type: 'EXTEND_SESSION' });
    }
  };

  const setUserDepartment = async (departmentId: string, department: string) => {
    if (!state.user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // For mock implementation, always succeed
      await localAuth.setUserDepartment(departmentId, department);
      
      // Update local state
      dispatch({ 
        type: 'SET_DEPARTMENT', 
        payload: { departmentId, department } 
      });
    } catch (error) {
      console.error('Error setting department:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const requireDepartmentSelection = () => {
    dispatch({ type: 'REQUIRE_DEPARTMENT_SELECTION', payload: true });
  };

  const getDepartments = async (): Promise<Department[]> => {
    try {
      return await localAuth.getDepartments();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  };

  const selectDepartment = (departmentId: string) => {
    dispatch({ type: 'SELECT_DEPARTMENT', payload: departmentId });
    dispatch({ type: 'REQUIRE_DEPARTMENT_SELECTION', payload: false });
  };

  // Check if department is selected
  useEffect(() => {
    // Admin users don't need to select a department
  }, [state.user, state.selectedDepartment, requireDepartmentSelection]);

  return (
    <AuthContext.Provider value={{
      state,
      login,
      logout,
      checkSession,
      extendSession,
      requireDepartmentSelection,
      setUserDepartment,
      getDepartments,
      selectDepartment
    }}>
      {state.requireDepartmentSelection ? (
        <DepartmentSelector
          onSelectDepartment={selectDepartment}
          availableDepartments={['Food and agriculture', 'Ores and minerals', 'Materials', 'Environmental', 'Pharmaceutical']}
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};