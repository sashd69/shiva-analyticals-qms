import React from 'react';
import { Clock, User, DollarSign, ArrowRight } from 'lucide-react';
import { Quote } from '../../types';

interface RecentQuotesProps {
  quotes: Quote[];
  onViewQuote: (quoteId: string) => void;
}

const RecentQuotes: React.FC<RecentQuotesProps> = ({ quotes, onViewQuote }) => {
  const getStatusColor = (status: Quote['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Quote['priority']) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-amber-100 text-amber-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Quotes</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center transition-colors">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {quotes.slice(0, 5).map((quote) => (
          <div
            key={quote.id}
            className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onViewQuote(quote.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-900">{quote.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(quote.priority)}`}>
                  {quote.priority.toUpperCase()}
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                ${quote.finalAmount.toLocaleString()}
              </span>
            </div>

            <h3 className="font-medium text-gray-900 mb-2">{quote.title}</h3>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {quote.clientName}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(quote.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {quote.tests.length} tests
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQuotes;