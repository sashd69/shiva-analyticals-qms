import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  TrendingUp,
  Search,
  User,
  LogOut,
  FlaskConical,
  Download,
  Calendar,
  DollarSign,
  Target,
  Award,
  Activity,
  Briefcase,
  PieChart,
  LineChart, 
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import { NotificationContainer } from '../Common/Notification';
import { useNotifications } from '../../hooks/useNotifications';
import { mockDepartmentMetrics } from '../../data/mockData';

import TargetManagement from './TargetManagement';
import TargetReporting from './TargetReporting';

interface EmployeePerformance {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  quotesCreated: number;
  quotesApproved: number;
  conversionRate: number;
  revenue: number;
  averageQuoteValue: number;
  efficiency: number;
  clientSatisfaction: number;
  ranking: number;
  trend: 'up' | 'down' | 'stable';
}

interface DepartmentMetrics {
  department: string;
  totalEmployees: number;
  totalQuotes: number;
  totalRevenue: number;
  averageConversionRate: number;
  efficiency: number;
  growth: number;
}

interface ResourceAllocation {
  department: string;
  currentWorkload: number;
  capacity: number;
  utilization: number;
  recommendedAction: string;
}

const ManagementPortal: React.FC = () => {
  const { state, logout, requireDepartmentSelection } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState(state.selectedDepartment || 'all');
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  
  // Check if department is selected
  useEffect(() => {
    if (state.user?.role === 'management' && !state.selectedDepartment) {
      requireDepartmentSelection();
    }
  }, [state.user, state.selectedDepartment, requireDepartmentSelection]);

  const departments = [
    'Food and agriculture',
    'Ores and minerals',
    'Materials',
    'Environmental',
    'Pharmaceutical'
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'performance', label: 'Employee Performance', icon: Users },
    { id: 'targets', label: 'Sales Targets', icon: Target },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
    { id: 'resources', label: 'Resource Management', icon: Briefcase },
    { id: 'forecasting', label: 'Revenue Forecasting', icon: TrendingUp },
  ];

  // Mock data
  const mockEmployeePerformance: EmployeePerformance[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@analytica.com',
      department: 'Food and agriculture',
      role: 'Sales',
      quotesCreated: 45,
      quotesApproved: 38,
      conversionRate: 84.4,
      revenue: 10415000,
      averageQuoteValue: 274078,
      efficiency: 92,
      clientSatisfaction: 4.8,
      ranking: 1,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@analytica.com',
      department: 'Ores and minerals',
      role: 'Sales',
      quotesCreated: 38,
      quotesApproved: 29,
      conversionRate: 76.3,
      revenue: 8167000,
      averageQuoteValue: 214921,
      efficiency: 88,
      clientSatisfaction: 4.6,
      ranking: 2,
      trend: 'stable'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma.wilson@analytica.com',
      department: 'Environmental',
      role: 'Sales',
      quotesCreated: 32,
      quotesApproved: 22,
      conversionRate: 68.8,
      revenue: 6501000,
      averageQuoteValue: 203156,
      efficiency: 82,
      clientSatisfaction: 4.4,
      ranking: 3,
      trend: 'down'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'david.rodriguez@analytica.com',
      department: 'Materials',
      role: 'Sales',
      quotesCreated: 28,
      quotesApproved: 24,
      conversionRate: 85.7,
      revenue: 7417000,
      averageQuoteValue: 264893,
      efficiency: 90,
      clientSatisfaction: 4.7,
      ranking: 4,
      trend: 'up'
    }
  ];

  const mockDepartmentMetrics: DepartmentMetrics[] = [
    {
      department: 'Food and agriculture',
      totalEmployees: 12,
      totalQuotes: 145,
      totalRevenue: 35415000,
      averageConversionRate: 78.5,
      efficiency: 89,
      growth: 15.2
    },
    {
      department: 'Ores and minerals',
      totalEmployees: 8,
      totalQuotes: 98,
      totalRevenue: 24836000,
      averageConversionRate: 72.1,
      efficiency: 85,
      growth: 8.7
    },
    {
      department: 'Environmental',
      totalEmployees: 10,
      totalQuotes: 112,
      totalRevenue: 29668000,
      averageConversionRate: 75.8,
      efficiency: 87,
      growth: 12.3
    },
    {
      department: 'Materials',
      totalEmployees: 6,
      totalQuotes: 76,
      totalRevenue: 19506000,
      averageConversionRate: 81.2,
      efficiency: 91,
      growth: 18.9
    },
    {
      department: 'Pharmaceutical',
      totalEmployees: 14,
      totalQuotes: 167,
      totalRevenue: 43567000,
      averageConversionRate: 79.3,
      efficiency: 88,
      growth: 22.1
    }
  ];

  const mockResourceAllocation: ResourceAllocation[] = [
    {
      department: 'Food and agriculture',
      currentWorkload: 85,
      capacity: 100,
      utilization: 85,
      recommendedAction: 'Optimal - maintain current levels'
    },
    {
      department: 'Ores and minerals',
      currentWorkload: 95,
      capacity: 100,
      utilization: 95,
      recommendedAction: 'High utilization - consider additional resources'
    },
    {
      department: 'Environmental',
      currentWorkload: 70,
      capacity: 100,
      utilization: 70,
      recommendedAction: 'Under-utilized - redistribute workload'
    },
    {
      department: 'Materials',
      currentWorkload: 88,
      capacity: 100,
      utilization: 88,
      recommendedAction: 'Good balance - monitor trends'
    },
    {
      department: 'Pharmaceutical',
      currentWorkload: 92,
      capacity: 100,
      utilization: 92,
      recommendedAction: 'Near capacity - plan for expansion'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600 transform rotate-90" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 80) return 'bg-amber-500';
    if (utilization >= 70) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const handleExportData = (format: string) => {
    alert(`Exporting data as ${format.toUpperCase()}`);
  };
  
  const handleExportReport = (format: 'excel' | 'pdf') => {
    showSuccess('Export Started', `Report is being exported as ${format.toUpperCase()}...`);
  };

  // Get department-specific metrics
  const getDepartmentMetrics = () => {
    if (selectedDepartment === 'all' || !selectedDepartment) {
      return {
        totalRevenue: mockDepartmentMetrics.reduce((sum, dept) => sum + dept.totalRevenue, 0),
        totalEmployees: mockDepartmentMetrics.reduce((sum, dept) => sum + dept.totalEmployees, 0),
        conversionRate: mockDepartmentMetrics.reduce((sum, dept) => sum + dept.averageConversionRate, 0) / mockDepartmentMetrics.length,
        efficiency: mockDepartmentMetrics.reduce((sum, dept) => sum + dept.efficiency, 0) / mockDepartmentMetrics.length,
        growth: mockDepartmentMetrics.reduce((sum, dept) => sum + dept.growth, 0) / mockDepartmentMetrics.length
      };
    }
    
    const deptMetrics = mockDepartmentMetrics.find(dept => dept.department === selectedDepartment);
    if (!deptMetrics) {
      return {
        totalRevenue: 0,
        totalEmployees: 0,
        conversionRate: 0,
        efficiency: 0,
        growth: 0
      };
    }
    
    return {
      totalRevenue: deptMetrics.totalRevenue,
      totalEmployees: deptMetrics.totalEmployees,
      conversionRate: deptMetrics.averageConversionRate,
      efficiency: deptMetrics.efficiency,
      growth: deptMetrics.growth
    };
  };

  const departmentMetrics = getDepartmentMetrics();

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-black rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Management Dashboard</h1>
        <p className="text-gray-300 text-lg">
          {selectedDepartment !== 'all' 
            ? `${selectedDepartment} Department Performance Overview` 
            : 'Strategic overview and performance management'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+{departmentMetrics.growth.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${(departmentMetrics.totalRevenue / 1000000).toFixed(2)}M</h3>
          <h3 className="text-2xl font-bold text-gray-900">₹{(departmentMetrics.totalRevenue / 10000000).toFixed(1)}Cr</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+3.8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{departmentMetrics.conversionRate.toFixed(1)}%</h3>
          <p className="text-gray-600">Avg Conversion Rate</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+{Math.round(departmentMetrics.totalEmployees * 0.1)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{departmentMetrics.totalEmployees}</h3>
          <p className="text-gray-600">Active Employees</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+2.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{departmentMetrics.efficiency}%</h3>
          <p className="text-gray-600">Team Efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDepartment !== 'all' ? `${selectedDepartment} Performance` : 'Department Performance'}
          </h3>
          <div className="space-y-4">
            {(selectedDepartment !== 'all' 
              ? mockDepartmentMetrics.filter(dept => dept.department === selectedDepartment)
              : mockDepartmentMetrics.slice(0, 4)
            ).map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{dept.department}</div>
                  <div className="text-sm text-gray-600">{dept.totalEmployees} employees • {dept.totalQuotes} quotes</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${(dept.totalRevenue / 1000).toFixed(0)}K</div>
                  <div className="font-bold text-gray-900">₹{(dept.totalRevenue / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-green-600">+{dept.growth}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {(selectedDepartment !== 'all'
              ? mockEmployeePerformance.filter(emp => emp.department === selectedDepartment)
              : mockEmployeePerformance.slice(0, 4)
            ).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.department}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{employee.conversionRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">₹{(employee.revenue / 100000).toFixed(1)}L</div>
                  </div>
                  {getTrendIcon(employee.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Performance</h1>
          <p className="text-gray-600 mt-1">
            {selectedDepartment !== 'all' 
              ? `Monitor ${selectedDepartment} department employee performance` 
              : 'Monitor and analyze individual and team performance metrics'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <button
            onClick={() => handleExportData('excel')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Quotes</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Conversion</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Efficiency</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Rank</th>
              </tr>
            </thead>
            <tbody>
              {(selectedDepartment !== 'all'
                ? mockEmployeePerformance.filter(emp => emp.department === selectedDepartment)
                : mockEmployeePerformance
              ).map((employee, index) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-600">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{employee.department}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-900">{employee.quotesCreated}</div>
                    <div className="text-sm text-gray-600">{employee.quotesApproved} approved</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-gray-900">{employee.conversionRate.toFixed(1)}%</span>
                      {getTrendIcon(employee.trend)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    ₹{(employee.revenue / 100000).toFixed(1)}L
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${employee.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{employee.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      <Award className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-gray-900">{employee.clientSatisfaction}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.ranking <= 2 ? 'bg-gold-100 text-gold-800' : 
                      employee.ranking <= 5 ? 'bg-silver-100 text-silver-800' : 
                      'bg-bronze-100 text-bronze-800'
                    }`}>
                      #{employee.ranking}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBusinessAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600 mt-1">
            {selectedDepartment !== 'all' 
              ? `${selectedDepartment} department performance analytics` 
              : 'Comprehensive business intelligence and performance analytics'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            onClick={() => handleExportData('pdf')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Department Revenue Analysis</h3>
          <div className="space-y-4">
            {(selectedDepartment !== 'all'
              ? mockDepartmentMetrics.filter(dept => dept.department === selectedDepartment)
              : mockDepartmentMetrics
            ).map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm text-gray-600">₹{(dept.totalRevenue / 100000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(dept.totalRevenue / Math.max(...mockDepartmentMetrics.map(d => d.totalRevenue))) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Growth: +{dept.growth}% • Conversion: {dept.averageConversionRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Conversion Rate</span>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">76.8%</div>
                <div className="text-xs text-blue-600">+5.2% from last month</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Team Efficiency</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">87.3%</div>
                <div className="text-xs text-green-600">+2.1% from last month</div>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-900">Average Deal Size</span>
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900">$3,245</div>
              <div className="text-2xl font-bold text-amber-900">₹2,70,375</div>
              <div className="text-xs text-amber-600">+8.7% from last month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-lg inline-block mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">598</div>
            <div className="text-sm text-gray-600">Total Quotes</div>
            <div className="text-xs text-green-600">+12% vs last period</div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-lg inline-block mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">459</div>
            <div className="text-sm text-gray-600">Approved Quotes</div>
            <div className="text-xs text-green-600">+8% vs last period</div>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-lg inline-block mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3.2</div>
            <div className="text-sm text-gray-600">Avg Days to Close</div>
            <div className="text-xs text-red-600">+0.3 vs last period</div>
          </div>
          <div className="text-center">
            <div className="bg-teal-100 p-3 rounded-lg inline-block mb-2">
              <Award className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.7</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
            <div className="text-xs text-green-600">+0.2 vs last period</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourceManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-1">
            {selectedDepartment !== 'all' 
              ? `Monitor ${selectedDepartment} resource utilization` 
              : 'Monitor workload distribution and resource utilization'}
          </p>
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Workload Distribution</h3>
          <div className="space-y-4">
            {(selectedDepartment !== 'all'
              ? mockResourceAllocation.filter(resource => resource.department === selectedDepartment)
              : mockResourceAllocation
            ).map((resource) => (
              <div key={resource.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{resource.department}</span>
                  <span className="text-sm text-gray-600">{resource.utilization}% utilized</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getUtilizationColor(resource.utilization)}`}
                    style={{ width: `${resource.utilization}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{resource.recommendedAction}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Alerts</h3>
          <div className="space-y-3">
            {selectedDepartment === 'all' || selectedDepartment === 'Ores and minerals' ? (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <div className="font-medium text-red-900">Ores and minerals - High Utilization</div>
                  <div className="text-sm text-red-700">95% capacity - Consider additional resources</div>
                </div>
              </div>
            ) : null}
            {selectedDepartment === 'all' || selectedDepartment === 'Pharmaceutical' ? (
              <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <div className="font-medium text-amber-900">Pharmaceutical - Near Capacity</div>
                  <div className="text-sm text-amber-700">92% capacity - Plan for expansion</div>
                </div>
              </div>
            ) : null}
            {selectedDepartment === 'all' || selectedDepartment === 'Environmental' ? (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-blue-900">Environmental - Under-utilized</div>
                  <div className="text-sm text-blue-700">70% capacity - Redistribute workload</div>
                </div>
              </div>
            ) : null}
            {selectedDepartment !== 'all' && 
             selectedDepartment !== 'Ores and minerals' && 
             selectedDepartment !== 'Pharmaceutical' && 
             selectedDepartment !== 'Environmental' && (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{selectedDepartment} - Normal Utilization</div>
                  <div className="text-sm text-gray-700">Resources are being utilized efficiently</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Department Capacity Planning</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Current Staff</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Workload</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Capacity</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Utilization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {(selectedDepartment !== 'all'
                ? mockResourceAllocation.filter(resource => resource.department === selectedDepartment)
                : mockResourceAllocation
              ).map((resource) => (
                <tr key={resource.department} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{resource.department}</td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {mockDepartmentMetrics.find(d => d.department === resource.department)?.totalEmployees || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{resource.currentWorkload}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{resource.capacity}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getUtilizationColor(resource.utilization)}`}
                          style={{ width: `${resource.utilization}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{resource.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{resource.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'performance':
        return renderPerformanceManagement();
      case 'analytics':
        return renderBusinessAnalytics();
      case 'targets':
        return <TargetManagement onShowNotification={showNotification} />;
      case 'resources':
        return renderResourceManagement();
      case 'forecasting':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revenue Forecasting</h1>
              <p className="text-gray-600 mt-1">Strategic planning and revenue projections</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Forecasting</h3>
              <p className="text-gray-600">Advanced forecasting models coming soon...</p>
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
        title="Management Portal"
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

export default ManagementPortal;