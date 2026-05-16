import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const navigate = useNavigate();
  const { state } = useAuth();

  const handleLogoClick = () => {
    if (state.isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div
      className={`flex items-center cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={handleLogoClick}
    >
      <span className={`font-extrabold text-blue-600 ${sizeClasses[size]}`}>
        A
      </span>
    </div>
  );
};

export default Logo;
