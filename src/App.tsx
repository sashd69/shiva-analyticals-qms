import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import SalesPortal from './components/Sales/SalesPortal';
import LoginForm from './components/Auth/LoginForm';
import AdminPortal from './components/Admin/AdminPortal';
import SupportPortal from './components/Support/SupportPortal';
import ManagementPortal from './components/Management/ManagementPortal';
import LoadingScreen from './components/Common/LoadingScreen';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  // Route to appropriate portal based on user role
  switch (state.user?.role) {
    case 'sales':
      return (
        <ProtectedRoute 
          allowedRoles={['sales']} 
          requiredDepartment={state.user.department}
        >
          <SalesPortal />
        </ProtectedRoute>
      );
    case 'admin':
      return (
        <ProtectedRoute 
          allowedRoles={['admin']}
          requiredDepartment={state.user.department}
        >
          <AdminPortal />
        </ProtectedRoute>
      );
    case 'support':
      return (
        <ProtectedRoute 
          allowedRoles={['support']}
          requiredDepartment={state.user.department}
        >
          <SupportPortal />
        </ProtectedRoute>
      );
    case 'management':
      return (
        <ProtectedRoute 
          allowedRoles={['management']}
          requiredDepartment={state.user.department}
        >
          <ManagementPortal />
        </ProtectedRoute>
      );
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
            <p className="text-gray-600">Please contact your administrator.</p>
          </div>
        </div>
      );
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;