import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-red-400 hover:text-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;