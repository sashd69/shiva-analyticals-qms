import React from 'react';
import { FlaskConical } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="text-center">
        <FlaskConical className="h-16 w-16 text-black mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytica</h2>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;