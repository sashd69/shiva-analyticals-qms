import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import LoginForm from '../Auth/LoginForm';
import UnauthorizedAccess from './UnauthorizedAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredDepartment?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requiredDepartment
}) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  // Check if user has the required role
  if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
    return <UnauthorizedAccess message="You don't have permission to access this area. Please contact your administrator." />;
  }

  // Check if user is assigned to the required department
  if (requiredDepartment && state.user && state.user.department !== requiredDepartment) {
    return <UnauthorizedAccess message={`You don't have access to the ${requiredDepartment} department. Your account is associated with the ${state.user.department} department.`} />;
  }

  // If user is authenticated and has the required role and department, render the children
  return <>{children}</>;
};

export default ProtectedRoute;