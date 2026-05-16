import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  User,
  Shield,
  Calendar,
  AlertTriangle,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '../../types';

interface UserManagementProps {
  users: UserType[];
  onCreateUser: (userData: Omit<UserType, 'id' | 'createdAt'>) => void;
  onUpdateUser: (userId: string, userData: Partial<UserType>) => void;
  onDeleteUser: (userId: string) => void;
  onShowNotification: (type: string, title: string, message?: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onShowNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'sales' as const,
    department: '',
    isActive: true
  });

  const departments = [
    'Food and agriculture',
    'Ores and minerals',
    'Materials',
    'Environmental',
    'Pharmaceutical'
  ];

  const roles = [
    { value: 'sales', label: 'Sales Employee' },
    { value: 'admin', label: 'Administrator' },
    { value: 'support', label: 'Support Team' },
    { value: 'management', label: 'Management' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (users.some(u => u.username === formData.username && u.id !== selectedUser?.id)) {
      newErrors.username = 'Username already exists';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (users.some(u => u.email === formData.email && u.id !== selectedUser?.id)) {
      newErrors.email = 'Email already exists';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'sales',
      department: '',
      isActive: true
    });
    setErrors({});
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onCreateUser({
        ...formData,
        permissions: []
      });
      
      onShowNotification('success', 'User Created', `User ${formData.firstName} ${formData.lastName} has been created successfully`);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onUpdateUser(selectedUser.id, formData);
      
      onShowNotification('success', 'User Updated', `User ${formData.firstName} ${formData.lastName} has been updated successfully`);
      setShowEditForm(false);
      setSelectedUser(null);
      resetForm();
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onDeleteUser(selectedUser.id);
      
      onShowNotification('success', 'User Deleted', `User ${selectedUser.firstName} ${selectedUser.lastName} has been deleted`);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });
    setShowEditForm(true);
  };

  const openViewModal = (user: UserType) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openDeleteConfirm = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleExportUsers = () => {
    onShowNotification('info', 'Export Started', 'User data is being exported to Excel...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => alert('Exporting user data to Excel...')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={openCreateForm}
            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <User className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="capitalize text-gray-900">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openViewModal(user)}
                        className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                        title="View User"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(user)}
                        className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(user)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showCreateForm ? 'Create New User' : 'Edit User'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {showCreateForm ? 'Add a new user to the system' : 'Modify user information and permissions'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.username ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter username"
                    />
                    {errors.username && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.department}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">User is active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={showCreateForm ? handleCreateUser : handleUpdateUser}
                  disabled={isLoading}
                  className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {showCreateForm ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {showCreateForm ? 'Create User' : 'Update User'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedUser(null);
                    resetForm();
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

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <p className="text-gray-600 mt-1">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Username:</span> {selectedUser.username}</div>
                      <div><span className="text-gray-600">Email:</span> {selectedUser.email}</div>
                      <div><span className="text-gray-600">Full Name:</span> {selectedUser.firstName} {selectedUser.lastName}</div>
                      <div><span className="text-gray-600">Role:</span> <span className="capitalize">{selectedUser.role}</span></div>
                      <div><span className="text-gray-600">Department:</span> {selectedUser.department}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div><span className="text-gray-600">Created:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                      <div><span className="text-gray-600">Last Login:</span> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Permissions</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedUser.permissions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.permissions.map((permission, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            • {permission.name} ({permission.module})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No specific permissions assigned. Role-based permissions apply.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditForm(selectedUser);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit User
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>? 
                This will permanently remove their account and all associated data.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? 'Deleting...' : 'Delete User'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedUser(null);
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

export default UserManagement;