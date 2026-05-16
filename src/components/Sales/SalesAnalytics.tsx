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
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Download,
  Calendar,
  Target
} from 'lucide-react';
import { SalesMetrics, MonthlyData, CustomerContact } from '../../types';

interface SalesAnalyticsProps {
  metrics: SalesMetrics;
  onExportReport: (format: 'excel' | 'pdf') => void;
  onGenerateTimeframeData: (timeframe: 'weekly' | 'monthly' | 'quarterly' | 'annual') => void;
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ metrics, onExportReport, onGenerateTimeframeData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'annual'>(metrics.period);

  const COLORS = ['#2B4C7E', '#45818E', '#FFA000', '#4CAF50', '#F44336', '#9C27B0'];

  const progressData = Object.entries(metrics.progressBreakdown).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count,
    percentage: ((count / metrics.totalContacts) * 100).toFixed(1)
  }));

  const conversionFunnelData = [
    { stage: 'Initial Calls', count: metrics.progressBreakdown.initial_call, rate: 100 },
    { stage: 'Meetings', count: metrics.progressBreakdown.offline_meeting, rate: (metrics.progressBreakdown.offline_meeting / metrics.progressBreakdown.initial_call * 100) },
    { stage: 'Quotations', count: metrics.progressBreakdown.quotation_phase, rate: (metrics.progressBreakdown.quotation_phase / metrics.progressBreakdown.initial_call * 100) },
    { stage: 'Closed Won', count: metrics.progressBreakdown.closed_won, rate: metrics.conversionRate }
  ];

  const kpiCards = [
    {
      title: 'Total Contacts',
      value: metrics.totalContacts.toString(),
      icon: Users,
      trend: '+12%',
      color: 'blue'
    },
    {
      title: 'Total Quotes',
      value: metrics.totalQuotes.toString(),
      icon: FileText,
      trend: '+8%',
      color: 'teal'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Target,
      trend: '+2.3%',
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`,
      icon: DollarSign,
      trend: '+15%',
      color: 'amber'
    },
    {
      title: 'Avg Quote Value',
      value: `₹${metrics.averageQuoteValue.toLocaleString()}`,
      icon: TrendingUp,
      trend: '+5%',
      color: 'purple'
    }
  ];

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      teal: 'text-teal-600',
      green: 'text-green-600',
      amber: 'text-amber-600',
      purple: 'text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const getBackgroundColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50',
      teal: 'bg-teal-50',
      green: 'bg-green-50',
      amber: 'bg-amber-50',
      purple: 'bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Performance metrics and conversion analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              const newPeriod = e.target.value as 'weekly' | 'monthly' | 'quarterly' | 'annual';
              setSelectedPeriod(newPeriod);
              onGenerateTimeframeData(newPeriod);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.trend.startsWith('+');
          
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getBackgroundColorClasses(card.color)}`}>
                  <Icon className={`h-6 w-6 ${getIconColorClasses(card.color)}`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {card.trend}
                </span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm font-medium text-gray-900">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedPeriod === 'weekly' ? 'Weekly' : 
             selectedPeriod === 'monthly' ? 'Monthly' : 
             selectedPeriod === 'quarterly' ? 'Quarterly' : 'Annual'} Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2B4C7E" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="quotes" stroke="#45818E" strokeWidth={2} name="Quotes" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <span className="text-sm text-gray-500">{stage.count} ({stage.rate.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stage.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2B4C7E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {selectedPeriod === 'weekly' ? 'Weekly' : 
           selectedPeriod === 'monthly' ? 'Monthly' : 
           selectedPeriod === 'quarterly' ? 'Quarterly' : 'Annual'} Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {selectedPeriod === 'weekly' ? 'Week' : 
                   selectedPeriod === 'monthly' ? 'Month' : 
                   selectedPeriod === 'quarterly' ? 'Quarter' : 'Year'}
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Contacts</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Quotes</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {metrics.monthlyTrend.map((month, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{month.month}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{month.contacts}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{month.quotes}</td>
                  <td className="py-3 px-4 text-right text-gray-900">${month.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{month.conversionRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;