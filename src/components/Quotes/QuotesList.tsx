import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Download,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import { Quote } from '../../types';

interface QuotesListProps {
  quotes: Quote[];
  onCreateQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onCreateQuote, 
  onViewQuote, 
  onEditQuote 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Quote['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Quote['priority']) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-amber-600',
      high: 'text-red-600'
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track laboratory service quotes</p>
        </div>
        <button
          onClick={onCreateQuote}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes, clients, or quote IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid gap-6">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-gray-900">{quote.id}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
                <span className={`text-xs font-bold ${getPriorityColor(quote.priority)}`}>
                  ● {quote.priority.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{quote.finalAmount.toLocaleString()}
                </div>
                {quote.discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    ₹{quote.totalAmount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-3">{quote.title}</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{quote.clientName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created {new Date(quote.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>{quote.tests.length} tests included</span>
              </div>
            </div>

            {quote.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{quote.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Expires: {new Date(quote.expiresAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewQuote(quote)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Quote"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditQuote(quote)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Quote"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Duplicate Quote">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Download PDF">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first quote'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button
              onClick={onCreateQuote}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Quote
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotesList;