import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Clock,
  Save,
  History,
  Paperclip
} from 'lucide-react';
import { Quote, QuoteStatus } from '../../types';
import { downloadQuotePDF } from '../../utils/pdfGenerator';
import { saveQuotes } from '../../utils/localStorage';

interface QuotationManagerProps {
  quotes: Quote[];
  onCreateQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onAutoSave: (quoteId: string, data: any) => void;
  onCopyQuote: (quote: Quote) => void;
  onDeleteQuote?: (quote: Quote) => void;
  onDuplicateQuote?: (quote: Quote) => void;
}

const QuotationManager: React.FC<QuotationManagerProps> = ({
  quotes,
  onCreateQuote,
  onViewQuote,
  onEditQuote,
  onAutoSave,
  onCopyQuote,
  onDeleteQuote,
  onDuplicateQuote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [autoSaveStatus, setAutoSaveStatus] = useState<Record<string, string>>({});

  const handleAutoSave = async (quoteId: string, data: any) => {
    // Auto-save functionality
    try {
      // Update the auto-save status in the UI
      setAutoSaveStatus(prev => ({
        ...prev,
        [quoteId]: 'Saved ' + new Date().toLocaleTimeString()
      }));
      
      // In a real app, this would call the API
      console.log('Auto-saving quote:', quoteId);
      
      // Update the quote's lastAutoSave timestamp
      const updatedQuotes = quotes.map(q => 
        q.id === quoteId ? { ...q, lastAutoSave: new Date().toISOString() } : q
      );
      
      // Save to localStorage
      saveQuotes(updatedQuotes);
      
      // Only attempt to save if we have a valid quote ID and it's a draft
      const quoteToUpdate = quotes.find(q => q.id === quoteId && q.status === 'draft');
      if (quoteToUpdate) {
        // Update the quote's lastAutoSave timestamp
        onAutoSave(quoteId, { lastAutoSave: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't rethrow error to prevent app crashes
    }
  };

  const handleDownloadQuote = (quote: Quote) => {
    try {
      downloadQuotePDF(quote);
      setAutoSaveStatus(prev => ({
        ...prev,
        [quote.id]: 'Downloaded ' + new Date().toLocaleTimeString()
      }));
    } catch (error) {
      console.error('Error downloading quote:', error);
      alert('Failed to download quote. Please try again.');
    }
  };

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      quotes.forEach(quote => {
        if (quote.status === 'draft') {
          onAutoSave(quote.id, { lastAutoSave: new Date().toISOString() });
          setAutoSaveStatus(prev => ({
            ...prev,
            [quote.id]: 'Saved ' + new Date().toLocaleTimeString()
          }));
        }
      });
    }, 120000); // Auto-save every 2 minutes

    return () => clearInterval(interval);
  }, [quotes, onAutoSave]);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: QuoteStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      revised: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-amber-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotation Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track quotations with auto-save and version control</p>
        </div>
        <button
          onClick={onCreateQuote}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
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
                placeholder="Search quotes, customers, or quote IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="revised">Revised</option>
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
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
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
                {quote.version > 1 && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    v{quote.version}
                  </span>
                )}
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
                <span>{quote.customerName}</span>
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

            {/* Auto-save status for drafts */}
            {quote.status === 'draft' && autoSaveStatus[quote.id] && (
              <div className="flex items-center text-xs text-black bg-gray-100 px-3 py-2 rounded-lg mb-4">
                <Save className="h-3 w-3 mr-1" />
                <span>{autoSaveStatus[quote.id]}</span>
              </div>
            )}

            {/* Attachments indicator */}
            {quote.attachments && quote.attachments.length > 0 && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Paperclip className="h-4 w-4 mr-2" />
                <span>{quote.attachments.length} attachment{quote.attachments.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Expiry warning */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {getTimeUntilExpiry(quote.expiresAt)}
              </div>
              {quote.versionHistory && quote.versionHistory.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <History className="h-4 w-4 mr-1" />
                  {quote.versionHistory.length} revision{quote.versionHistory.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {quote.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{quote.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(quote.updatedAt).toLocaleDateString()}
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
                <button
                  onClick={() => onCopyQuote(quote)}
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Duplicate Quote"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownloadQuote(quote)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Download PDF"
                >
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
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
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

export default QuotationManager;