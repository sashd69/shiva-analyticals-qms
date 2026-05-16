import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Building,
  Users,
  X,
  Save,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  budget?: number;
}

interface DepartmentManagementProps {
  onShowNotification: (type: string, title: string, message?: string) => void;
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ onShowNotification }) => {
  // Mock departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Food and agriculture',
      description: 'Agricultural and food safety testing services',
      head: 'Dr. Sarah Johnson',
      employeeCount: 12,
      isActive: true,
      createdAt: '2024-01-15',
      budget: 500000
    },
    {
      id: '2',
      name: 'Ores and minerals',
      description: 'Geological and mineral analysis laboratory',
      head: 'Dr. Michael Chen',
      employeeCount: 8,
      isActive: true,
      createdAt: '2024-01-10',
      budget: 750000
    },
    {
      id: '3',
      name: 'Materials',
      description: 'Materials science and engineering testing',
      head: 'Dr. David Rodriguez',
      employeeCount: 6,
      isActive: true,
      createdAt: '2024-01-20',
      budget: 600000
    },
    {
      id: '4',
      name: 'Environmental',
      description: 'Environmental monitoring and analysis',
      head: 'Dr. Emma Wilson',
      employeeCount: 10,
      isActive: true,
      createdAt: '2024-02-01',
      budget: 550000
    },
    {
      id: '5',
      name: 'Pharmaceutical',
      description: 'Pharmaceutical and biomedical testing',
      head: 'Dr. Lisa Anderson',
      employeeCount: 14,
      isActive: true,
      createdAt: '2024-01-05',
      budget: 800000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    budget: 0,
    isActive: true
  });

  // Mock department heads
  const departmentHeads = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. David Rodriguez',
    'Dr. Emma Wilson',
    'Dr. Lisa Anderson',
    'Dr. James Parker',
    'Dr. Maria Garcia'
  ];

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    } else if (departments.some(d => d.name.toLowerCase() === formData.name.toLowerCase() && d.id !== selectedDepartment?.id)) {
      newErrors.name = 'Department name already exists';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.head.trim()) {
      newErrors.head = 'Department head is required';
    }

    if (formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      head: '',
      budget: 0,
      isActive: true
    });
    setErrors({});
  };

  const handleCreateDepartment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newDepartment: Department = {
        id: (departments.length + 1).toString(),
        ...formData,
        employeeCount: 0,
        createdAt: new Date().toISOString()
      };

      setDepartments(prev => [...prev, newDepartment]);
      
      onShowNotification('success', 'Department Created', `Department "${formData.name}" has been created successfully`);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to create department. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment || !validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setDepartments(prev => prev.map(dept => 
        dept.id === selectedDepartment.id 
          ? { ...dept, ...formData }
          : dept
      ));
      
      onShowNotification('success', 'Department Updated', `Department "${formData.name}" has been updated successfully`);
      setShowEditForm(false);
      setSelectedDepartment(null);
      resetForm();
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to update department. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    // Check for dependencies
    if (selectedDepartment.employeeCount > 0) {
      onShowNotification('error', 'Cannot Delete Department', `This department has ${selectedDepartment.employeeCount} employees assigned. Please reassign them first.`);
      setShowDeleteConfirm(false);
      setSelectedDepartment(null);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setDepartments(prev => prev.filter(dept => dept.id !== selectedDepartment.id));
      
      onShowNotification('success', 'Department Deleted', `Department "${selectedDepartment.name}" has been deleted`);
      setShowDeleteConfirm(false);
      setSelectedDepartment(null);
    } catch (error) {
      onShowNotification('error', 'Error', 'Failed to delete department. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      head: department.head,
      budget: department.budget || 0,
      isActive: department.isActive
    });
    setShowEditForm(true);
  };

  const openViewModal = (department: Department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const openDeleteConfirm = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage laboratory departments and their configurations</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments by name, description, or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-black" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                department.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {department.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 mb-2">{department.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{department.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{department.employeeCount} employees</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Head:</span> {department.head}
              </div>
              {department.budget && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Budget:</span> ₹{department.budget.toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Created: {new Date(department.createdAt).toLocaleDateString()}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => openViewModal(department)}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button
                onClick={() => openEditForm(department)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Department"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => openDeleteConfirm(department)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Department"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Department Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showCreateForm ? 'Create New Department' : 'Edit Department'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {showCreateForm ? 'Add a new department to the system' : 'Modify department information'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedDepartment(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter department name"
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter department description"
                  />
                  {errors.description && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.head}
                      onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.head ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select department head</option>
                      {departmentHeads.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                    {errors.head && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.head}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Budget (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.budget ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0"
                    />
                    {errors.budget && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.budget}
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
                    <span className="ml-2 text-sm font-medium text-gray-700">Department is active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={showCreateForm ? handleCreateDepartment : handleUpdateDepartment}
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
                      {showCreateForm ? 'Create Department' : 'Update Department'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedDepartment(null);
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

      {/* View Department Modal */}
      {showViewModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Department Details</h2>
                  <p className="text-gray-600 mt-1">{selectedDepartment.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDepartment(null);
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
                      <div><span className="text-gray-600">Name:</span> {selectedDepartment.name}</div>
                      <div><span className="text-gray-600">Head:</span> {selectedDepartment.head}</div>
                      <div><span className="text-gray-600">Employees:</span> {selectedDepartment.employeeCount}</div>
                      <div><span className="text-gray-600">Budget:</span> ₹{selectedDepartment.budget?.toLocaleString() || 'Not set'}</div>
                      <div><span className="text-gray-600">Created:</span> {new Date(selectedDepartment.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedDepartment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedDepartment.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedDepartment.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditForm(selectedDepartment);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit Department
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDepartment(null);
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
      {showDeleteConfirm && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Department</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedDepartment.name}</strong>? 
                {selectedDepartment.employeeCount > 0 && (
                  <span className="text-red-600 block mt-2">
                    Warning: This department has {selectedDepartment.employeeCount} employees assigned.
                  </span>
                )}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteDepartment}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? 'Deleting...' : 'Delete Department'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedDepartment(null);
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

export default DepartmentManagement;