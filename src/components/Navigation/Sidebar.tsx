import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  FlaskConical, 
  Settings, 
  BarChart3,
  Bell,
  Search
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'tests', label: 'Test Catalog', icon: FlaskConical },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <FlaskConical className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Shiva Analyticals</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 mr-3 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'quotes' && (
                    <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                      8
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Notifications */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center mb-2">
            <Bell className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Updates</span>
          </div>
          <p className="text-xs text-blue-700 mb-2">
            3 quotes pending approval
          </p>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View all →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;