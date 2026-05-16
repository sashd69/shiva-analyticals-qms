import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  Database,
  Search,
  UserIcon,
  LogOut,
  FlaskConical,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Download,
  UserPlus,
  Building,
  DollarSign,
  Activity,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationContainer } from '../Common/Notification';
import { useNotifications } from '../../hooks/useNotifications';
import UserManagement from './UserManagement';
import DepartmentManagement from './DepartmentManagement';
import SystemConfiguration from './SystemConfiguration';
import Header from '../Layout/Header';
import EmployeeLoginTable from './EmployeeLoginTable';
import { User, SystemConfig, AuditLog } from '../../types';
import { userService } from '../../services/database';

const AdminPortal: React.FC = () => {
  const { state, logout, requireDepartmentSelection } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { notifications, removeNotification, showSuccess, showError, showInfo } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if department is selected
  // Admin users don't need to select a department
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'credentials', label: 'Login Credentials', icon: Key },
    { id: 'system', label: 'System Config', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
  ];

  // User management handlers
  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    
    // Log audit action
    console.log('AUDIT LOG: User created', { userId: newUser.id, action: 'CREATE_USER', by: state.user?.id });
  };

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    
    // Log audit action
    console.log('AUDIT LOG: User updated', { userId, action: 'UPDATE_USER', by: state.user?.id });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Log audit action
    console.log('AUDIT LOG: User deleted', { userId, action: 'DELETE_USER', by: state.user?.id });
  };

  // Notification handler
  const showNotification = (type: string, title: string, message?: string) => {
    switch (type) {
      case 'success':
        showSuccess(title, message);
        break;
      case 'error':
        showError(title, message);
        break;
      case 'info':
        showInfo(title, message);
        break;
      default:
        showInfo(title, message);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-black rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-300 text-lg">
          System overview and management tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">45</h3>
          <p className="text-gray-600">Total Users</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
          <p className="text-gray-600">Total Quotes</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">98.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Online</h3>
          <p className="text-gray-600">System Status</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$1.2M</h3>
          <h3 className="text-2xl font-bold text-gray-900">₹10Cr</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">User Management</div>
                  <div className="text-sm text-gray-600">admin@analytica.com</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">System Configuration</div>
                  <div className="text-sm text-gray-600">admin@analytica.com</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Department Update</div>
                  <div className="text-sm text-gray-600">admin@analytica.com</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            {['Food and agriculture', 'Ores and minerals', 'Materials', 'Environmental', 'Pharmaceutical'].map((dept) => (
              <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{dept}</div>
                <div className="text-sm text-gray-600">
                  {Math.floor(Math.random() * 10) + 5} users
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return (
          <UserManagement
            users={users}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onShowNotification={showNotification}
          />
        );
      case 'departments':
        return (
          <DepartmentManagement onShowNotification={showNotification} />
        );
      case 'credentials':
        return (
          <EmployeeLoginTable />
        );
      case 'system':
        return (
          <SystemConfiguration onShowNotification={showNotification} />
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
              <p className="text-gray-600 mt-1">Performance metrics and usage statistics</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Detailed analytics coming soon...</p>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-gray-600 mt-1">System activity and security logs</p>
              </div>
              <button
                onClick={() => showInfo('Export Started', 'Audit logs are being exported...')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Module</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date().toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">admin@analytica.com</td>
                      <td className="py-3 px-4 text-gray-900">User Management</td>
                      <td className="py-3 px-4 text-gray-900">Administration</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date().toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">admin@analytica.com</td>
                      <td className="py-3 px-4 text-gray-900">System Configuration</td>
                      <td className="py-3 px-4 text-gray-900">Administration</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date().toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900">admin@analytica.com</td>
                        <td className="py-3 px-4 text-gray-900">Department Management</td>
                        <td className="py-3 px-4 text-gray-900">Administration</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                          </span>
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Admin Portal"
        onNavigateHome={() => setActiveSection('dashboard')}
        selectedDepartment={state.selectedDepartment}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <main className="mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

export default AdminPortal;