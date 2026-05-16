import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Save,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  CheckCircle,
  AlertTriangle,
  Filter,
  BarChart3,
  FileText
} from 'lucide-react';
import { SalesTarget, MonthlyTarget } from '../../types';
import { mockSalesTargets, calculateTargetProgress } from '../../data/targetMockData';
import { useNotifications } from '../../hooks/useNotifications';

interface TargetManagementProps {
  onShowNotification?: (type: string, title: string, message?: string) => void;
}

const TargetManagement: React.FC<TargetManagementProps> = ({ onShowNotification }) => {
  const [targets, setTargets] = useState<SalesTarget[]>(mockSalesTargets);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<SalesTarget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError } = useNotifications();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    year: new Date().getFullYear(),
    annualTarget: 0,
    notes: ''
  });

  // Mock employees data
  const employees = [
    { id: '1', name: 'Sarah Johnson', department: 'Food and agriculture' },
    { id: '2', name: 'Michael Chen', department: 'Ores and minerals' },
    { id: '3', name: 'Emma Wilson', department: 'Environmental' },
    { id: '4', name: 'David Rodriguez', department: 'Materials' },
    { id: '5', name: 'Lisa Anderson', department: 'Pharmaceutical' }
  ];

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = target.year === yearFilter;
    return matchesSearch && matchesYear;
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }
    
    if (formData.annualTarget <= 0) {
      newErrors.annualTarget = 'Annual target must be greater than zero';
    }

    if (formData.year < 2020 || formData.year > 2030) {
      newErrors.year = 'Year must be between 2020 and 2030';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      year: new Date().getFullYear(),
      annualTarget: 0,
      notes: ''
    });
    setErrors({});
  };

  const handleCreateTarget = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate monthly targets
      const monthlyTargets: MonthlyTarget[] = Array.from({ length: 12 }, (_, i) => {
        const monthlyAmount = Math.round(formData.annualTarget / 12);
        return {
          month: i + 1,
          targetAmount: monthlyAmount,
          actualAmount: 0,
          shortfall: 0,
          isAdjusted: false,
          achievementPercentage: 0
        };
      });
      
      const employee = employees.find(e => e.id === formData.employeeId);
      
      const newTarget: SalesTarget = {
        id: Date.now().toString(),
        employeeId: formData.employeeId,
        employeeName: employee?.name || '',
        year: formData.year,
        annualTarget: formData.annualTarget,
        monthlyTargets,
        notes: formData.notes,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTargets(prev => [...prev, newTarget]);
      
      if (onShowNotification) {
        onShowNotification('success', 'Target Created', `Sales target for ${employee?.name} has been created successfully`);
      } else {
        showSuccess('Target Created', `Sales target for ${employee?.name} has been created successfully`);
      }
      
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      if (onShowNotification) {
        onShowNotification('error', 'Error', 'Failed to create target. Please try again.');
      } else {
        showError('Error', 'Failed to create target. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTarget = async () => {
    if (!selectedTarget || !validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate new monthly targets
      const oldMonthlyTotal = selectedTarget.annualTarget;
      const newMonthlyTotal = formData.annualTarget;
      const ratio = newMonthlyTotal / oldMonthlyTotal;
      
      // Adjust monthly targets proportionally
      const updatedMonthlyTargets = selectedTarget.monthlyTargets.map(target => {
        const newTargetAmount = Math.round(target.targetAmount * ratio);
        return {
          ...target,
          targetAmount: newTargetAmount,
          adjustedAmount: newTargetAmount,
          isAdjusted: true,
          shortfall: Math.max(0, newTargetAmount - target.actualAmount)
        };
      });
      
      const updatedTarget = {
        ...selectedTarget,
        employeeId: formData.employeeId,
        employeeName: employees.find(e => e.id === formData.employeeId)?.name || selectedTarget.employeeName,
        year: formData.year,
        annualTarget: formData.annualTarget,
        monthlyTargets: updatedMonthlyTargets,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };

      setTargets(prev => prev.map(target => 
        target.id === selectedTarget.id ? updatedTarget : target
      ));
      
      if (onShowNotification) {
        onShowNotification('success', 'Target Updated', `Sales target for ${updatedTarget.employeeName} has been updated successfully`);
      } else {
        showSuccess('Target Updated', `Sales target for ${updatedTarget.employeeName} has been updated successfully`);
      }
      
      setShowEditForm(false);
      setSelectedTarget(null);
      resetForm();
    } catch (error) {
      if (onShowNotification) {
        onShowNotification('error', 'Error', 'Failed to update target. Please try again.');
      } else {
        showError('Error', 'Failed to update target. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTarget = async (targetId: string) => {
    if (!window.confirm('Are you sure you want to delete this target? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const targetToDelete = targets.find(t => t.id === targetId);
      
      setTargets(prev => prev.filter(target => target.id !== targetId));
      
      if (onShowNotification) {
        onShowNotification('success', 'Target Deleted', `Sales target for ${targetToDelete?.employeeName} has been deleted`);
      } else {
        showSuccess('Target Deleted', `Sales target for ${targetToDelete?.employeeName} has been deleted`);
      }
    } catch (error) {
      if (onShowNotification) {
        onShowNotification('error', 'Error', 'Failed to delete target. Please try again.');
      } else {
        showError('Error', 'Failed to delete target. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (target: SalesTarget) => {
    setSelectedTarget(target);
    setFormData({
      employeeId: target.employeeId,
      employeeName: target.employeeName,
      year: target.year,
      annualTarget: target.annualTarget,
      notes: target.notes || ''
    });
    setShowEditForm(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setFormData(prev => ({
      ...prev,
      employeeId,
      employeeName: employee?.name || ''
    }));
  };

  const handleExportTargets = (format: 'excel' | 'pdf') => {
    if (onShowNotification) {
      onShowNotification('info', 'Export Started', `Exporting targets as ${format.toUpperCase()}...`);
    } else {
      showSuccess('Export Started', `Exporting targets as ${format.toUpperCase()}...`);
    }
  };

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Target Management</h1>
          <p className="text-gray-600 mt-1">Set and monitor sales targets for your team</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExportTargets('excel')}
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
            New Target
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
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid gap-6">
        {filteredTargets.map((target) => {
          const progress = calculateTargetProgress(target);
          
          return (
            <div key={target.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{target.employeeName}</h3>
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {target.year} Annual Target
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(target.annualTarget)}
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    <span className={`text-sm font-medium ${progress.isOnTrack ? 'text-green-600' : 'text-amber-600'}`}>
                      {progress.isOnTrack ? (
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                      )}
                      {progress.isOnTrack ? 'On Track' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Annual Progress</span>
                  <span className={`font-medium ${getAchievementColor(progress.achievementPercentage)}`}>
                    {progress.achievementPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressBarColor(progress.achievementPercentage)}`} 
                    style={{ width: `${Math.min(100, progress.achievementPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Achieved: {formatCurrency(progress.totalAchieved)}</span>
                  <span>Remaining: {formatCurrency(progress.remainingAmount)}</span>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Monthly Breakdown</h4>
                <div className="grid grid-cols-6 gap-2">
                  {target.monthlyTargets.slice(0, 6).map((month) => (
                    <div key={month.month} className="text-center">
                      <div className="text-xs text-gray-600">{new Date(0, month.month - 1).toLocaleString('default', { month: 'short' })}</div>
                      <div className={`text-sm font-medium ${
                        month.achievementPercentage >= 100 ? 'text-green-600' : 
                        month.achievementPercentage >= 80 ? 'text-amber-600' : 
                        month.achievementPercentage > 0 ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {month.achievementPercentage > 0 ? `${month.achievementPercentage}%` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Adjustments */}
              {target.monthlyTargets.some(m => m.isAdjusted) && (
                <div className="bg-amber-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Target Adjustments</p>
                      <p className="text-xs text-amber-700">
                        Monthly targets have been adjusted to account for previous shortfalls.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {target.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{target.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(target.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditForm(target)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Target"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTarget(target.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Target"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTargets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No targets found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || yearFilter !== new Date().getFullYear()
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first sales target'
            }
          </p>
          {(!searchTerm && yearFilter === new Date().getFullYear()) && (
            <button
              onClick={openCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Target
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Target Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showCreateForm ? 'Create New Sales Target' : 'Edit Sales Target'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {showCreateForm ? 'Set a new annual sales target for an employee' : 'Modify existing sales target'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedTarget(null);
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
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    disabled={showEditForm}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.employeeId ? 'border-red-500' : 'border-gray-200'
                    } ${showEditForm ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.employeeId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.year ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {[2023, 2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.year}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Target (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        value={formData.annualTarget}
                        onChange={(e) => setFormData(prev => ({ ...prev, annualTarget: parseInt(e.target.value) || 0 }))}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.annualTarget ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.annualTarget && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.annualTarget}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Monthly Target: {formatCurrency(Math.round(formData.annualTarget / 12))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any additional notes or context..."
                  />
                </div>

                {showEditForm && selectedTarget && (
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Target Adjustment Warning</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Changing the annual target will proportionally adjust all monthly targets.
                          Past achievements will not be modified, but future targets will be recalculated.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={showCreateForm ? handleCreateTarget : handleUpdateTarget}
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
                      {showCreateForm ? 'Create Target' : 'Update Target'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedTarget(null);
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
    </div>
  );
};

export default TargetManagement;