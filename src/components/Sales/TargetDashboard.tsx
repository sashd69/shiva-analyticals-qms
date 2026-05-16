import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Target,
  Award,
  Download,
  Edit,
  Bell
} from 'lucide-react';
import { SalesTarget, TargetNotification } from '../../types';
import { mockSalesTargets, mockTargetNotifications, calculateTargetProgress } from '../../data/targetMockData';
import { useAuth } from '../../contexts/AuthContext';

interface TargetDashboardProps {
  onExportReport: (format: 'excel' | 'pdf') => void;
}

const TargetDashboard: React.FC<TargetDashboardProps> = ({ onExportReport }) => {
  const { state } = useAuth();
  const [userTarget, setUserTarget] = useState<SalesTarget | null>(null);
  const [notifications, setNotifications] = useState<TargetNotification[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [personalTargets, setPersonalTargets] = useState<Record<number, number>>({});
  const [showPersonalTargetForm, setShowPersonalTargetForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [personalTargetAmount, setPersonalTargetAmount] = useState<number>(0);

  // Fetch user's target data
  useEffect(() => {
    // In a real app, this would be an API call
    const userId = state.user?.id || '';
    const userTargetData = mockSalesTargets.find(target => 
      target.employeeId === userId && target.year === selectedYear
    );
    
    if (userTargetData) {
      setUserTarget(userTargetData);
      
      // Initialize personal targets from existing data
      const personalTargetsMap: Record<number, number> = {};
      userTargetData.monthlyTargets.forEach(monthly => {
        if (monthly.personalTarget) {
          personalTargetsMap[monthly.month] = monthly.personalTarget;
        }
      });
      setPersonalTargets(personalTargetsMap);
    } else {
      setUserTarget(null);
    }
    
    // Get user notifications
    const userNotifications = mockTargetNotifications.filter(
      notification => notification.employeeId === userId
    );
    setNotifications(userNotifications);
  }, [state.user?.id, selectedYear]);

  const handleSetPersonalTarget = () => {
    if (!selectedMonth || !userTarget) return;
    
    // Get the management target for this month
    const monthlyTarget = userTarget.monthlyTargets.find(m => m.month === selectedMonth);
    if (!monthlyTarget) return;
    
    // Ensure personal target is at least equal to management target
    if (personalTargetAmount < monthlyTarget.targetAmount) {
      alert(`Personal target must be at least ${formatCurrency(monthlyTarget.targetAmount)}`);
      return;
    }
    
    // Update personal targets
    setPersonalTargets(prev => ({
      ...prev,
      [selectedMonth]: personalTargetAmount
    }));
    
    // In a real app, this would be saved to the database
    
    // Close the form
    setShowPersonalTargetForm(false);
    setSelectedMonth(null);
    setPersonalTargetAmount(0);
  };

  const openPersonalTargetForm = (month: number) => {
    setSelectedMonth(month);
    
    // Get current personal target or use management target as default
    const monthlyTarget = userTarget?.monthlyTargets.find(m => m.month === month);
    const currentPersonalTarget = personalTargets[month] || monthlyTarget?.targetAmount || 0;
    
    setPersonalTargetAmount(currentPersonalTarget);
    setShowPersonalTargetForm(true);
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

  const getMonthName = (month: number) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  const getCurrentMonth = () => {
    return new Date().getMonth() + 1; // 1-12
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!userTarget) return [];
    
    return userTarget.monthlyTargets.map(monthly => ({
      name: getMonthName(monthly.month).substring(0, 3),
      target: monthly.targetAmount,
      personal: personalTargets[monthly.month] || monthly.targetAmount,
      actual: monthly.actualAmount,
      month: monthly.month
    }));
  };

  const chartData = prepareChartData();
  
  // Calculate overall progress
  const progress = userTarget ? calculateTargetProgress(userTarget) : null;

  if (!userTarget) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Sales Targets</h1>
            <p className="text-gray-600 mt-1">Track your performance against targets</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Target Found</h3>
          <p className="text-gray-600 mb-6">
            You don't have any sales targets set for {selectedYear}. Please contact your manager.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Sales Targets</h1>
          <p className="text-gray-600 mt-1">Track your performance against targets</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={() => onExportReport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-black" />
            <span className="text-blue-600 text-sm font-medium">Annual</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(userTarget.annualTarget)}</h3>
          <p className="text-gray-600">Annual Target</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">
              {progress?.achievementPercentage}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(progress?.totalAchieved || 0)}</h3>
          <p className="text-gray-600">Achieved So Far</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-black" />
            <span className={`text-sm font-medium ${progress?.isOnTrack ? 'text-green-600' : 'text-amber-600'}`}>
              {progress?.isOnTrack ? 'On Track' : 'Behind'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(progress?.remainingAmount || 0)}</h3>
          <p className="text-gray-600">Remaining Target</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-black" />
            <span className="text-blue-600 text-sm font-medium">Current</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(userTarget.monthlyTargets.find(m => m.month === getCurrentMonth())?.targetAmount || 0)}
          </h3>
          <p className="text-gray-600">This Month's Target</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar dataKey="target" name="Management Target" fill="#93c5fd" />
                <Bar dataKey="personal" name="Personal Target" fill="#3b82f6" />
                <Bar dataKey="actual" name="Actual Sales" fill="#1d4ed8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Progress Line Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cumulative Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.map((item, index, array) => {
                  // Calculate cumulative values
                  const cumulativeTarget = array
                    .slice(0, index + 1)
                    .reduce((sum, curr) => sum + curr.target, 0);
                  
                  const cumulativeActual = array
                    .slice(0, index + 1)
                    .reduce((sum, curr) => sum + curr.actual, 0);
                  
                  return {
                    ...item,
                    cumulativeTarget,
                    cumulativeActual
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeTarget" 
                  name="Target (Cumulative)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeActual" 
                  name="Actual (Cumulative)" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Targets Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Targets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Management Target</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Personal Target</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actual Sales</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Achievement</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userTarget.monthlyTargets.map((monthly) => {
                const isCurrentOrPastMonth = monthly.month <= getCurrentMonth();
                const personalTarget = personalTargets[monthly.month] || monthly.targetAmount;
                const achievementPercentage = isCurrentOrPastMonth 
                  ? Math.round((monthly.actualAmount / monthly.targetAmount) * 100) 
                  : 0;
                
                return (
                  <tr key={monthly.month} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {getMonthName(monthly.month)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(monthly.targetAmount)}
                      {monthly.isAdjusted && (
                        <span className="ml-1 text-amber-600 text-xs">
                          (Adjusted)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(personalTarget)}
                      {personalTarget > monthly.targetAmount && (
                        <span className="ml-1 text-green-600 text-xs">
                          (+{Math.round((personalTarget / monthly.targetAmount - 1) * 100)}%)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {isCurrentOrPastMonth ? formatCurrency(monthly.actualAmount) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isCurrentOrPastMonth ? (
                        <span className={`font-medium ${getAchievementColor(achievementPercentage)}`}>
                          {achievementPercentage}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isCurrentOrPastMonth ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          achievementPercentage >= 100 
                            ? 'bg-green-100 text-green-800' 
                            : achievementPercentage >= 80 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {achievementPercentage >= 100 
                            ? 'Achieved' 
                            : achievementPercentage >= 80 
                              ? 'Near Target' 
                              : 'Below Target'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openPersonalTargetForm(monthly.month)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Set Personal Target"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Target Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}`}
              >
                <div className="flex items-start">
                  {notification.type === 'target_set' && <Target className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />}
                  {notification.type === 'target_adjusted' && <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />}
                  {notification.type === 'target_achieved' && <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />}
                  {notification.type === 'target_missed' && <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />}
                  
                  <div className="flex-1">
                    <p className={`text-sm ${notification.isRead ? 'text-gray-900' : 'text-blue-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  {!notification.isRead && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Target Modal */}
      {showPersonalTargetForm && selectedMonth !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Set Personal Target</h2>
                  <p className="text-gray-600 text-sm">
                    {getMonthName(selectedMonth)} {selectedYear}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPersonalTargetForm(false);
                    setSelectedMonth(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Management Target
                  </label>
                  <div className="bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
                    {formatCurrency(userTarget.monthlyTargets.find(m => m.month === selectedMonth)?.targetAmount || 0)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your personal target must be equal to or higher than the management target.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Personal Target
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min={userTarget.monthlyTargets.find(m => m.month === selectedMonth)?.targetAmount || 0}
                      step="10000"
                      value={personalTargetAmount}
                      onChange={(e) => setPersonalTargetAmount(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={handleSetPersonalTarget}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Set Personal Target
                </button>
                <button
                  onClick={() => {
                    setShowPersonalTargetForm(false);
                    setSelectedMonth(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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

export default TargetDashboard;