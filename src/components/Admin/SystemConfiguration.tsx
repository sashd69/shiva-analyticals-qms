import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield,
  Database,
  Bell,
  Clock,
  Edit,
  Check,
  X,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { SystemConfig } from '../../types';

interface SystemConfigurationProps {
  onShowNotification: (type: string, title: string, message?: string) => void;
}

const SystemConfiguration: React.FC<SystemConfigurationProps> = ({ onShowNotification }) => {
  // Mock system configurations
  const [configs, setConfigs] = useState<SystemConfig[]>([
    {
      id: '1',
      key: 'session_timeout',
      value: '30',
      description: 'Session timeout in minutes',
      category: 'Security',
      dataType: 'number',
      isEditable: true,
      lastModified: '2024-03-15T10:30:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '2',
      key: 'auto_save_interval',
      value: '2',
      description: 'Auto-save interval in minutes',
      category: 'System',
      dataType: 'number',
      isEditable: true,
      lastModified: '2024-03-14T14:20:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '3',
      key: 'max_file_size',
      value: '10',
      description: 'Maximum file upload size in MB',
      category: 'File Management',
      dataType: 'number',
      isEditable: true,
      lastModified: '2024-03-13T09:15:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '4',
      key: 'email_notifications',
      value: 'true',
      description: 'Enable email notifications for important events',
      category: 'Notifications',
      dataType: 'boolean',
      isEditable: true,
      lastModified: '2024-03-12T16:45:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '5',
      key: 'backup_frequency',
      value: 'daily',
      description: 'Database backup frequency',
      category: 'Database',
      dataType: 'string',
      isEditable: true,
      lastModified: '2024-03-11T11:30:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '6',
      key: 'system_version',
      value: '2.1.0',
      description: 'Current system version',
      category: 'System',
      dataType: 'string',
      isEditable: false,
      lastModified: '2024-03-01T08:00:00Z',
      modifiedBy: 'System'
    },
    {
      id: '7',
      key: 'quote_expiry_days',
      value: '30',
      description: 'Default quote expiry period in days',
      category: 'Business',
      dataType: 'number',
      isEditable: true,
      lastModified: '2024-03-10T13:20:00Z',
      modifiedBy: 'Admin User'
    },
    {
      id: '8',
      key: 'maintenance_mode',
      value: 'false',
      description: 'Enable maintenance mode (blocks user access)',
      category: 'System',
      dataType: 'boolean',
      isEditable: true,
      lastModified: '2024-03-05T18:00:00Z',
      modifiedBy: 'Admin User'
    }
  ]);

  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [configToUpdate, setConfigToUpdate] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [...new Set(configs.map(config => config.category))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'Database':
        return <Database className="h-5 w-5 text-green-600" />;
      case 'Notifications':
        return <Bell className="h-5 w-5 text-amber-600" />;
      case 'System':
        return <Settings className="h-5 w-5 text-gray-600" />;
      case 'File Management':
        return <Settings className="h-5 w-5 text-purple-600" />;
      case 'Business':
        return <Clock className="h-5 w-5 text-teal-600" />;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const validateValue = (config: SystemConfig, value: string) => {
    const newErrors: Record<string, string> = {};

    switch (config.dataType) {
      case 'number':
        if (isNaN(Number(value))) {
          newErrors[config.id] = 'Must be a valid number';
        } else if (Number(value) < 0) {
          newErrors[config.id] = 'Must be a positive number';
        }
        break;
      case 'boolean':
        if (!['true', 'false'].includes(value.toLowerCase())) {
          newErrors[config.id] = 'Must be true or false';
        }
        break;
      case 'string':
        if (!value.trim()) {
          newErrors[config.id] = 'Value cannot be empty';
        }
        break;
    }

    // Special validations
    if (config.key === 'session_timeout' && Number(value) < 5) {
      newErrors[config.id] = 'Session timeout must be at least 5 minutes';
    }
    if (config.key === 'max_file_size' && Number(value) > 100) {
      newErrors[config.id] = 'Max file size cannot exceed 100 MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startEditing = (config: SystemConfig) => {
    if (!config.isEditable) return;
    setEditingConfig(config.id);
    setTempValue(config.value);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingConfig(null);
    setTempValue('');
    setErrors({});
  };

  const confirmSave = (config: SystemConfig) => {
    if (!validateValue(config, tempValue)) return;

    // Show confirmation for critical settings
    const criticalSettings = ['maintenance_mode', 'session_timeout', 'backup_frequency'];
    if (criticalSettings.includes(config.key)) {
      setConfigToUpdate(config);
      setShowConfirmDialog(true);
    } else {
      saveConfig(config);
    }
  };

  const saveConfig = async (config: SystemConfig) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setConfigs(prev => prev.map(c => 
        c.id === config.id 
          ? { 
              ...c, 
              value: tempValue,
              lastModified: new Date().toISOString(),
              modifiedBy: 'Current Admin'
            }
          : c
      ));

      onShowNotification('success', 'Configuration Updated', `${config.description} has been updated successfully`);
      
      // Special handling for maintenance mode
      if (config.key === 'maintenance_mode' && tempValue === 'true') {
        onShowNotification('warning', 'Maintenance Mode Enabled', 'Users will not be able to access the system');
      }
      
      setEditingConfig(null);
      setTempValue('');
      setConfigToUpdate(null);
      setShowConfirmDialog(false);
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to update configuration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    const confirmed = window.confirm('Are you sure you want to reset all configurations to default values? This action cannot be undone.');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Reset to default values
      const defaultConfigs = configs.map(config => ({
        ...config,
        value: getDefaultValue(config.key),
        lastModified: new Date().toISOString(),
        modifiedBy: 'System Reset'
      }));

      setConfigs(defaultConfigs);
      onShowNotification('success', 'Reset Complete', 'All configurations have been reset to default values');
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to reset configurations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultValue = (key: string) => {
    const defaults: Record<string, string> = {
      session_timeout: '30',
      auto_save_interval: '2',
      max_file_size: '10',
      email_notifications: 'true',
      backup_frequency: 'daily',
      quote_expiry_days: '30',
      maintenance_mode: 'false'
    };
    return defaults[key] || '';
  };

  const renderConfigValue = (config: SystemConfig) => {
    if (editingConfig === config.id) {
      if (config.dataType === 'boolean') {
        return (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[config.id] ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      } else {
        return (
          <input
            type={config.dataType === 'number' ? 'number' : 'text'}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[config.id] ? 'border-red-500' : 'border-gray-200'
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') confirmSave(config);
              if (e.key === 'Escape') cancelEditing();
            }}
            autoFocus
          />
        );
      }
    }

    return (
      <div className="flex items-center justify-between">
        <span className={`font-medium ${
          config.key === 'maintenance_mode' && config.value === 'true' ? 'text-red-600' : 'text-gray-900'
        }`}>
          {config.dataType === 'boolean' ? (config.value === 'true' ? 'Enabled' : 'Disabled') : config.value}
        </span>
        {config.isEditable && (
          <button
            onClick={() => startEditing(config)}
            className="ml-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-600 mt-1">Manage system settings and parameters</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Configuration Categories */}
      <div className="grid gap-6">
        {categories.map(category => (
          <div key={category} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-bold text-gray-900 ml-2">{category}</h3>
            </div>

            <div className="space-y-4">
              {configs.filter(config => config.category === category).map(config => (
                <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-900 mr-2">
                          {config.key.replace(/_/g, ' ').toUpperCase()}
                        </h4>
                        {!config.isEditable && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            Read-only
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                      <div className="text-xs text-gray-500">
                        Last modified: {new Date(config.lastModified).toLocaleString()} by {config.modifiedBy}
                      </div>
                    </div>
                    <div className="ml-4 min-w-[200px]">
                      {renderConfigValue(config)}
                      {errors[config.id] && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[config.id]}
                        </div>
                      )}
                    </div>
                  </div>

                  {editingConfig === config.id && (
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                      <button
                        onClick={() => confirmSave(config)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && configToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Configuration Change</h3>
                  <p className="text-gray-600">This is a critical system setting</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">{configToUpdate.description}</div>
                  <div className="text-gray-600">
                    Changing from <span className="font-medium">{configToUpdate.value}</span> to <span className="font-medium">{tempValue}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to make this change? This setting affects system behavior and security.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => saveConfig(configToUpdate)}
                  disabled={isLoading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? 'Updating...' : 'Confirm Change'}
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfigToUpdate(null);
                    cancelEditing();
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfiguration;