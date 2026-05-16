import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../Layout/Breadcrumb';

interface SampleComparisonData {
  quoteId: string;
  customerName: string;
  quotedSamples: number;
  actualSamples: number;
  quotedValue: number;
  actualValue: number;
  discrepancyPercentage: number;
  status: 'normal' | 'warning' | 'critical';
  dateReceived: string;
  notes?: string;
}

const SampleComparison: React.FC = () => {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState(state.selectedDepartment || '');

  // Mock data for sample comparisons
  const mockData: SampleComparisonData[] = [
    {
      quoteId: 'Q-2024-001',
      customerName: 'Apollo Hospital Delhi',
      quotedSamples: 100,
      actualSamples: 95,
      quotedValue: 375000,
      actualValue: 356250,
      discrepancyPercentage: -5.0,
      status: 'normal',
      dateReceived: '2024-03-15',
      notes: 'Slight shortage in samples received'
    },
    {
      quoteId: 'Q-2024-002',
      customerName: 'Fortis Hospital Mumbai',
      quotedSamples: 80,
      actualSamples: 80,
      quotedValue: 232000,
      actualValue: 232000,
      discrepancyPercentage: 0,
      status: 'normal',
      dateReceived: '2024-03-16'
    },
    {
      quoteId: 'Q-2024-003',
      customerName: 'AIIMS New Delhi',
      quotedSamples: 50,
      actualSamples: 35,
      quotedValue: 180000,
      actualValue: 126000,
      discrepancyPercentage: -30.0,
      status: 'critical',
      dateReceived: '2024-03-14',
      notes: 'Significant sample shortage - customer notified'
    },
    {
      quoteId: 'Q-2024-004',
      customerName: 'Max Healthcare',
      quotedSamples: 25,
      actualSamples: 30,
      quotedValue: 125000,
      actualValue: 150000,
      discrepancyPercentage: 20.0,
      status: 'warning',
      dateReceived: '2024-03-17',
      notes: 'Additional samples received - billing adjusted'
    }
  ];

  const departments = [
    'Food and agriculture',
    'Ores and minerals', 
    'Materials',
    'Environmental',
    'Pharmaceutical'
  ];

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.quoteId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getDiscrepancyIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (percentage < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const breadcrumbItems = [
    { label: 'Dashboard', onClick: () => window.location.reload() },
    { label: selectedDepartment || 'Department' },
    { label: 'Sample Comparison', isActive: true }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sample Comparison Analysis</h1>
          <p className="text-gray-600 mt-1">Compare quoted vs actual samples and values</p>
        </div>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Quotations
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by quote ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-green-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {filteredData.reduce((sum, item) => sum + item.actualSamples, 0)}
          </h3>
          <p className="text-gray-600">Total Samples Received</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">+2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ₹{(filteredData.reduce((sum, item) => sum + item.actualValue, 0) / 100000).toFixed(1)}L
          </h3>
          <p className="text-gray-600">Actual Value</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <span className="text-amber-600 text-sm font-medium">3 items</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {filteredData.filter(item => item.status === 'warning' || item.status === 'critical').length}
          </h3>
          <p className="text-gray-600">Discrepancies Found</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">92%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {((filteredData.filter(item => item.status === 'normal').length / filteredData.length) * 100).toFixed(0)}%
          </h3>
          <p className="text-gray-600">Accuracy Rate</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Quote ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Customer</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Quoted Samples</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Actual Samples</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Sample Variance</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Quoted Value</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Actual Value</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Value Variance</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date Received</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.quoteId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{item.quoteId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{item.customerName}</td>
                  <td className="py-4 px-6 text-center text-gray-900">{item.quotedSamples}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-medium ${
                      item.actualSamples < item.quotedSamples ? 'text-red-600' : 
                      item.actualSamples > item.quotedSamples ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {item.actualSamples}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center">
                      {getDiscrepancyIcon(item.actualSamples - item.quotedSamples)}
                      <span className={`ml-1 font-medium ${
                        item.actualSamples < item.quotedSamples ? 'text-red-600' : 
                        item.actualSamples > item.quotedSamples ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {item.actualSamples - item.quotedSamples > 0 ? '+' : ''}{item.actualSamples - item.quotedSamples}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">₹{item.quotedValue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-medium ${
                      item.actualValue < item.quotedValue ? 'text-red-600' : 
                      item.actualValue > item.quotedValue ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      ₹{item.actualValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center">
                      {getDiscrepancyIcon(item.discrepancyPercentage)}
                      <span className={`ml-1 font-medium ${
                        item.discrepancyPercentage < 0 ? 'text-red-600' : 
                        item.discrepancyPercentage > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {item.discrepancyPercentage > 0 ? '+' : ''}{item.discrepancyPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.dateReceived).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Section */}
      {filteredData.some(item => item.notes) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
          <div className="space-y-3">
            {filteredData.filter(item => item.notes).map((item) => (
              <div key={item.quoteId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{item.quoteId} - {item.customerName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleComparison;