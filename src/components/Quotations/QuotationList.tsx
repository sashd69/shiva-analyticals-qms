import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Download,
  Trash2,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Quote } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../Layout/Breadcrumb';

interface QuotesListProps {
  quotes: Quote[];
  onCreateQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onDeleteQuote: (quote: Quote) => void;
  onDuplicateQuote: (quote: Quote) => void;
  isLoading?: boolean;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onCreateQuote, 
  onViewQuote, 
  onEditQuote,
  onDeleteQuote,
  onDuplicateQuote,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Quote | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { state } = useAuth();

  const filteredQuotes = quotes.filter(quote => {
    return colors[priority];
  });

  const handleAction = async (action: () => Promise<void> | void, actionId: string) => {
    setActionLoading(actionId);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (quote: Quote) => {
    await handleAction(async () => {
      onDeleteQuote(quote);
      setShowDeleteConfirm(null);
    }, `delete-${quote.id}`);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', onClick: () => window.location.reload() },
    { label: state.selectedDepartment || 'Department' },
    { label: 'Quotations', isActive: true }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
        <div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotations...</p>
        </div>
      )}

      {/* Quotes Grid */}
      {!isLoading && (
        <div className="grid gap-6">
        {filteredQuotes.map((quote) => (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Expires: {new Date(quote.expiresAt).toLocaleDateString()}
                {quote.status === 'approved' && (
                  <span className="ml-2 inline-flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewQuote(quote)}
                  disabled={actionLoading === `view-${quote.id}`}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Quote"
                >
                  {actionLoading === `view-${quote.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleAction(() => onEditQuote(quote), `edit-${quote.id}`)}
                  disabled={actionLoading === `edit-${quote.id}` || quote.status === 'approved'}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Quote"
                >
                  {actionLoading === `edit-${quote.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </button>
                <button 
                  onClick={() => handleAction(() => onDuplicateQuote(quote), `copy-${quote.id}`)}
                  disabled={actionLoading === `copy-${quote.id}`}
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                  title="Duplicate Quote"
                >
                  {actionLoading === `copy-${quote.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button 
                  onClick={() => handleAction(() => {
                    // Simulate PDF download
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = `quote-${quote.id}.pdf`;
                    link.click();
                  }, `download-${quote.id}`)}
                  disabled={actionLoading === `download-${quote.id}`}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                  title="Download PDF"
                >
                  {actionLoading === `download-${quote.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
                {quote.status === 'draft' && (
                  <button 
                    onClick={() => setShowDeleteConfirm(quote)}
                    disabled={actionLoading === `delete-${quote.id}`}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete Quote"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!isLoading && filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Quotation</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete quotation <strong>{showDeleteConfirm.id}</strong>?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={actionLoading === `delete-${showDeleteConfirm.id}`}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {actionLoading === `delete-${showDeleteConfirm.id}` ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={actionLoading === `delete-${showDeleteConfirm.id}`}
                className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesList;