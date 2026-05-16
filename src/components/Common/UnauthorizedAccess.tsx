import React from 'react';
import { ShieldAlert, Building, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UnauthorizedAccessProps {
  message: string;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({ message }) => {
  const { state, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Building className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-900">
              Your Department: {state.user?.department || 'Not Assigned'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Role: <span className="font-medium capitalize">{state.user?.role}</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;