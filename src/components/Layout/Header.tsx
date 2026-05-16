import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  LogOut, 
  FlaskConical, 
  Home,
  Menu,
  X,
  ChevronDown,
  FileText,
  Users,
  BarChart3,
  Settings,
  Package,
  MessageSquare,
  Shield,
  Building,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

interface HeaderProps {
  title: string;
  onNavigateHome?: () => void;
  selectedDepartment?: string | null;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onNavigateHome,
  selectedDepartment,
  activeSection = 'dashboard',
  onSectionChange
}) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      // Default navigation to dashboard
      window.location.reload();
    }
  };

  const getMenuItems = (role: UserRole) => {
    switch (role) {
      case 'sales':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'contacts', label: 'Contact Log', icon: Users },
          { id: 'quotes', label: 'Quotations', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'departments', label: 'Departments', icon: Building },
          { id: 'credentials', label: 'Login Credentials', icon: Shield },
          { id: 'system', label: 'System Config', icon: Settings },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'audit', label: 'Audit Logs', icon: Shield },
        ];
      case 'support':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'samples', label: 'Sample Analysis', icon: FlaskConical },
          { id: 'comparison', label: 'Sample Comparison', icon: Package },
          { id: 'complaints', label: 'Complaint Management', icon: MessageSquare },
        ];
      case 'management':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'performance', label: 'Employee Performance', icon: Users },
          { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
          { id: 'resources', label: 'Resource Management', icon: Building },
          { id: 'forecasting', label: 'Revenue Forecasting', icon: DollarSign },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home }
        ];
    }
  };

  const menuItems = state.user ? getMenuItems(state.user.role) : [];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center h-16 px-4 lg:px-6">
        {/* Logo and Title - Left Side */}
        <div className="flex items-center mr-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shiva Analyticals</h1>
              <p className="text-sm text-gray-600 hidden md:block">{title}</p>
            </div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 ml-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange && onSectionChange(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-black font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Actions - Right Side */}
        <div className="flex items-center ml-auto space-x-3">
          {/* Department Badge - Always show selected department */}
          {selectedDepartment && (
            <div className="hidden md:flex bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {selectedDepartment}
            </div>
          )}
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm font-medium text-gray-900">
                {state.user?.firstName} {state.user?.lastName}
              </p>
              <p className="text-xs text-gray-600 capitalize">{state.user?.role}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-1"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange && onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-100 text-black font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {state.selectedDepartment && (
            <div className="mt-4 py-2 border-t border-gray-200">
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Department:</span>
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {selectedDepartment}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;