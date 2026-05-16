import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-green-400 hover:text-green-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;