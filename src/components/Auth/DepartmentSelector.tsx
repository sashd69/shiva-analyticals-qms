import React, { useState, useEffect } from 'react';
import { Building, ChevronRight, FlaskConical, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DepartmentSelectorProps {
  onSelectDepartment: (departmentId: string) => void;
  availableDepartments: string[];
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ 
  onSelectDepartment, 
  availableDepartments 
}) => {
  const [selectedDept, setSelectedDept] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { state } = useAuth();
  const { logout } = useAuth();

  const handleSelect = () => {
    if (!selectedDept) {
      setError('Please select a department to continue');
      return;
    }
    
    setError('');
    setShowConfirmation(true);
  };

  const confirmSelection = () => {
    onSelectDepartment(selectedDept);
  };

  const handleBackToLogin = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Department Selection Required</h1>
          <p className="text-gray-600">
            Please select a department to continue. This is required before you can access the {state.user?.role} portal.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {availableDepartments.map((dept) => (
            <div
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedDept === dept
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">{dept}</span>
                </div>
                {selectedDept === dept && (
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSelect}
            disabled={!selectedDept}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Continue with Selected Department
          </button>
          
          <button
            onClick={handleBackToLogin}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login Page
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Department Selection</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              You have selected <span className="font-bold">{selectedDept}</span> as your working department. 
              You will only be able to upload and manage quotations for this department.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmSelection}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Confirm Selection
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg"
              >
                Change Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;