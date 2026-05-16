import React from 'react';
import DashboardStats from './DashboardStats';
import RecentQuotes from './RecentQuotes';
import { mockDashboardStats, mockQuotes } from '../../data/mockData';
import { Calendar, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onViewQuote: (quoteId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewQuote }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Anderson</h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your laboratory operations today.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-blue-100 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={mockDashboardStats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentQuotes quotes={mockQuotes} onViewQuote={onViewQuote} />
        </div>

        {/* Quick Actions & Analytics */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span>Create New Quote</span>
              </button>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                Add New Client
              </button>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                Generate Report
              </button>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Performance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Monthly Target</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-medium">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">On-time Delivery</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;