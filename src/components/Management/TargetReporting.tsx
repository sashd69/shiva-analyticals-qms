import React, { useState } from 'react';
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  FileText,
  TrendingUp,
  Users,
  Building,
  Award
} from 'lucide-react';
import { mockSalesTargets, calculateTargetProgress } from '../../data/targetMockData';

interface TargetReportingProps {
  onExportReport: (format: 'excel' | 'pdf') => void;
}

const TargetReporting: React.FC<TargetReportingProps> = ({ onExportReport }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'employee'>('monthly');

  // Mock departments
  const departments = [
    'Food and agriculture',
    'Ores and minerals',
    'Materials',
    'Environmental',
    'Pharmaceutical'
  ];

  // Filter targets based on selected filters
  const filteredTargets = mockSalesTargets.filter(target => {
    const matchesYear = target.year === selectedYear;
    const matchesDepartment = selectedDepartment === 'all' || true; // In a real app, would filter by department
    return matchesYear && matchesDepartment;
  });

  // Calculate overall achievement
  const calculateOverallAchievement = () => {
    const totalTarget = filteredTargets.reduce((sum, target) => sum + target.annualTarget, 0);
    const totalAchieved = filteredTargets.reduce((sum, target) => {
      return sum + target.monthlyTargets.reduce((monthSum, month) => monthSum + month.actualAmount, 0);
    }, 0);
    
    return {
      totalTarget,
      totalAchieved,
      achievementPercentage: totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0
    };
  };

  const overallAchievement = calculateOverallAchievement();

  // Prepare monthly report data
  const prepareMonthlyReportData = () => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      target: 0,
      actual: 0,
      achievement: 0
    }));
    
    filteredTargets.forEach(target => {
      target.monthlyTargets.forEach(monthly => {
        monthlyData[monthly.month - 1].target += monthly.targetAmount;
        monthlyData[monthly.month - 1].actual += monthly.actualAmount;
      });
    });
    
    // Calculate achievement percentages
    monthlyData.forEach(month => {
      month.achievement = month.target > 0 ? Math.round((month.actual / month.target) * 100) : 0;
    });
    
    return monthlyData;
  };

  // Prepare employee report data
  const prepareEmployeeReportData = () => {
    return filteredTargets.map(target => {
      const progress = calculateTargetProgress(target);
      return {
        name: target.employeeName,
        target: target.annualTarget,
        actual: progress.totalAchieved,
        achievement: progress.achievementPercentage
      };
    }).sort((a, b) => b.achievement - a.achievement);
  };

  // Prepare department report data
  const prepareDepartmentReportData = () => {
    const departmentData: Record<string, { target: number; actual: number; name: string }> = {};
    
    // Initialize departments
    departments.forEach(dept => {
      departmentData[dept] = { target: 0, actual: 0, name: dept };
    });
    
    // Aggregate data by department
    filteredTargets.forEach(target => {
      // In a real app, you would use the actual department
      const dept = 'Food and agriculture'; // Placeholder
      
      if (departmentData[dept]) {
        departmentData[dept].target += target.annualTarget;
        departmentData[dept].actual += calculateTargetProgress(target).totalAchieved;
      }
    });
    
    // Convert to array and calculate achievement
    return Object.values(departmentData).map(dept => ({
      ...dept,
      achievement: dept.target > 0 ? Math.round((dept.actual / dept.target) * 100) : 0
    }));
  };

  const monthlyReportData = prepareMonthlyReportData();
  const employeeReportData = prepareEmployeeReportData();
  const departmentReportData = prepareDepartmentReportData();

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target Performance Reports</h1>
          <p className="text-gray-600 mt-1">Analyze sales target performance across the organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onExportReport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
          <button
            onClick={() => onExportReport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setReportType('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  reportType === 'monthly' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setReportType('yearly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  reportType === 'yearly' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setReportType('employee')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  reportType === 'employee' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Employee
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-black" />
            <span className={`text-sm font-medium ${
              overallAchievement.achievementPercentage >= 100 ? 'text-green-600' : 
              overallAchievement.achievementPercentage >= 80 ? 'text-amber-600' : 
              'text-red-600'
            }`}>
              {overallAchievement.achievementPercentage}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(overallAchievement.totalAchieved)}</h3>
          <p className="text-gray-600">Total Achievement</p>
          <div className="text-sm text-gray-500 mt-1">
            Target: {formatCurrency(overallAchievement.totalTarget)}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-black" />
            <span className="text-blue-600 text-sm font-medium">{filteredTargets.length}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {employeeReportData.filter(emp => emp.achievement >= 100).length}
          </h3>
          <p className="text-gray-600">Employees On Target</p>
          <div className="text-sm text-gray-500 mt-1">
            Out of {filteredTargets.length} total employees
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">Top Performer</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {employeeReportData.length > 0 ? employeeReportData[0].name : 'N/A'}
          </h3>
          <p className="text-gray-600">Highest Achievement</p>
          <div className="text-sm text-gray-500 mt-1">
            {employeeReportData.length > 0 ? `${employeeReportData[0].achievement}% of target` : ''}
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'monthly' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Monthly Performance Report</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {selectedYear}
            </div>
          </div>
          
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyReportData}
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
                <Bar dataKey="target" name="Target" fill="#93c5fd" />
                <Bar dataKey="actual" name="Actual" fill="#1d4ed8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Target</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Achievement</th>
                </tr>
              </thead>
              <tbody>
                {monthlyReportData.map((month) => {
                  const variance = month.actual - month.target;
                  
                  return (
                    <tr key={month.month} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {new Date(0, month.month - 1).toLocaleString('default', { month: 'long' })}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(month.target)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(month.actual)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${getAchievementColor(month.achievement)}`}>
                          {month.achievement}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total</td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(monthlyReportData.reduce((sum, month) => sum + month.target, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(monthlyReportData.reduce((sum, month) => sum + month.actual, 0))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {(() => {
                      const variance = monthlyReportData.reduce((sum, month) => sum + month.actual - month.target, 0);
                      return (
                        <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${getAchievementColor(overallAchievement.achievementPercentage)}`}>
                      {overallAchievement.achievementPercentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'employee' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Employee Performance Report</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              {filteredTargets.length} Employees
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={employeeReportData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="target" name="Target" fill="#93c5fd" />
                  <Bar dataKey="actual" name="Actual" fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employeeReportData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="actual"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {employeeReportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Annual Target</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Achieved</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Remaining</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Achievement</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeReportData.map((employee) => {
                  const remaining = employee.target - employee.actual;
                  
                  return (
                    <tr key={employee.name} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(employee.target)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(employee.actual)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(remaining)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${getAchievementColor(employee.achievement)}`}>
                          {employee.achievement}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.achievement >= 100 
                            ? 'bg-green-100 text-green-800' 
                            : employee.achievement >= 80 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.achievement >= 100 
                            ? 'On Target' 
                            : employee.achievement >= 80 
                              ? 'Near Target' 
                              : 'Below Target'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'yearly' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Yearly Performance Report</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {selectedYear}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentReportData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="target"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentReportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentReportData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="target" name="Target" fill="#93c5fd" />
                  <Bar dataKey="actual" name="Actual" fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Annual Target</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Achieved</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Remaining</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Achievement</th>
                </tr>
              </thead>
              <tbody>
                {departmentReportData.map((dept) => {
                  const remaining = dept.target - dept.actual;
                  
                  return (
                    <tr key={dept.name} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {dept.name}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(dept.target)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(dept.actual)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(remaining)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${getAchievementColor(dept.achievement)}`}>
                          {dept.achievement}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total</td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(departmentReportData.reduce((sum, dept) => sum + dept.target, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(departmentReportData.reduce((sum, dept) => sum + dept.actual, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(departmentReportData.reduce((sum, dept) => sum + (dept.target - dept.actual), 0))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${getAchievementColor(overallAchievement.achievementPercentage)}`}>
                      {overallAchievement.achievementPercentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetReporting;