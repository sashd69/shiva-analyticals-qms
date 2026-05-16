import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Building, 
  User, 
  Calendar,
  ChevronRight,
  Filter,
  Edit,
  Eye
} from 'lucide-react';
import { CustomerContact, ProgressStatus } from '../../types';
import { contactService } from '../../services/database';
import { useAuth } from '../../contexts/AuthContext';

interface ContactLogProps {
  contacts: CustomerContact[];
  onCreateContact: () => void;
  onEditContact: (contact: CustomerContact) => void;
  onViewContact: (contact: CustomerContact) => void;
}

const ContactLog: React.FC<ContactLogProps> = ({
  contacts,
  onCreateContact,
  onEditContact,
  onViewContact
}) => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Load contacts
  useEffect(() => {
    // Set loading to false after component mounts
    setLoading(false);
  }, []);

  const departments = [
    'Food and agriculture',
    'Ores and minerals', 
    'Materials',
    'Environmental',
    'Pharmaceutical'
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.progressStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || contact.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: ProgressStatus) => {
    const colors = {
      initial_call: 'bg-blue-100 text-blue-800',
      offline_meeting: 'bg-amber-100 text-amber-800',
      quotation_phase: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: ProgressStatus) => {
    const labels = {
      initial_call: 'Initial Call',
      offline_meeting: 'Offline Meeting',
      quotation_phase: 'Quotation Phase',
      negotiation: 'Negotiation',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost'
    };
    return labels[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-amber-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getProgressSteps = (currentStatus: ProgressStatus) => {
    const steps = ['initial_call', 'offline_meeting', 'quotation_phase'];
    const currentIndex = steps.indexOf(currentStatus);
    return steps.map((step, index) => ({
      status: step,
      completed: index <= currentIndex,
      current: step === currentStatus
    }));
  };

  const handleShowNotification = (type: string, title: string, message?: string) => {
    switch (type) {
      case 'success':
        alert(`Success: ${title}${message ? ' - ' + message : ''}`);
        break;
      case 'error':
        alert(`Error: ${title}${message ? ' - ' + message : ''}`);
        break;
      case 'info':
        alert(`Info: ${title}${message ? ' - ' + message : ''}`);
        break;
      default:
        alert(`Info: ${title}${message ? ' - ' + message : ''}`);
    }
  };

  const handleUpdateContactStatus = (contactId: string, newStatus: ProgressStatus, notes?: string) => {
    const updateStatus = async () => {
      try {
        // Find the contact to update
        const contactToUpdate = contacts.find(c => c.id === contactId);
        if (!contactToUpdate) return;
        
        // Create a new status history entry
        const statusChange = {
          id: `status-${Date.now()}`,
          fromStatus: contactToUpdate.progressStatus,
          toStatus: newStatus,
          timestamp: new Date().toISOString(),
          notes: notes || undefined,
          changedBy: state.user?.firstName + ' ' + state.user?.lastName || 'User'
        };
        
        // Update the contact with new status and history
        const updatedContact = {
          ...contactToUpdate,
          progressStatus: newStatus,
          updatedAt: new Date().toISOString(),
          statusHistory: [...contactToUpdate.statusHistory, statusChange]
        };
        
        await contactService.updateContact(contactId, updatedContact);
        
        // Update local state
        setContacts(prev => prev.map(contact => contact.id === contactId ? updatedContact : contact));
        
        handleShowNotification('success', 'Status Updated', `Contact status changed to ${getStatusLabel(newStatus)}`);
      } catch (error) {
        console.error('Failed to update contact status:', error);
        handleShowNotification('error', 'Update Failed', 'Could not update contact status. Please try again.');
      }
    };

    updateStatus();
  };

  const handleEditContactClick = (contact: CustomerContact) => {
    onEditContact(contact);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Contact Log</h1>
          <p className="text-gray-600 mt-1">Track customer interactions and progress through sales pipeline</p>
        </div>
        <button
          onClick={onCreateContact}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, companies, or contacts..."
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
              <option value="initial_call">Initial Call</option>
              <option value="offline_meeting">Offline Meeting</option>
              <option value="quotation_phase">Quotation Phase</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid gap-6">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{contact.customerName}</h3>
                  <p className="text-sm text-gray-600">{contact.companyName}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.progressStatus)}`}>
                  {getStatusLabel(contact.progressStatus)}
                </span>
                <select
                  value={contact.progressStatus}
                  onChange={(e) => {
                    const notes = prompt('Add notes for status change (optional):');
                    handleUpdateContactStatus(contact.id, e.target.value as ProgressStatus, notes || undefined);
                  }}
                  onClick={() => handleEditContactClick(contact)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="initial_call">Initial Call</option>
                  <option value="offline_meeting">Offline Meeting</option>
                  <option value="quotation_phase">Quotation Phase</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
                <span className={`text-xs font-bold ${getPriorityColor(contact.priority)}`}>
                  ● {contact.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Progress:</span>
              </div>
              <div className="flex items-center space-x-1">
                {getProgressSteps(contact.progressStatus).map((step, index) => (
                  <React.Fragment key={step.status}>
                    <div className={`w-3 h-3 rounded-full ${
                      step.completed ? 'bg-blue-600' : 'bg-gray-300'
                    } ${step.current ? 'ring-2 ring-blue-300' : ''}`} />
                    {index < getProgressSteps(contact.progressStatus).length - 1 && (
                      <div className={`w-8 h-0.5 ${step.completed ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{contact.contactPerson}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{contact.phone}</span>
              </div>
            </div>

            {/* Status History Preview */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
              <div className="space-y-1">
                {contact.statusHistory.slice(-2).map((status) => (
                  <div key={status.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <div className="flex justify-between items-start">
                      <span>
                        {status.fromStatus ? `${getStatusLabel(status.fromStatus)} →` : ''} {getStatusLabel(status.toStatus)}
                      </span>
                      <span className="text-gray-500">
                        {new Date(status.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {status.notes && (
                      <div className="mt-1 text-gray-600">{status.notes}</div>
                    )}
                  </div>
                ))}
                {contact.statusHistory.length > 2 && (
                  <div className="text-xs text-black text-center cursor-pointer hover:underline"
                       onClick={() => onViewContact(contact)}>
                    View all {contact.statusHistory.length} status changes
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created: {new Date(contact.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Updated: {new Date(contact.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Notes Preview */}
            {contact.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">{contact.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onViewContact(contact)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </button>
              <button
                onClick={() => onEditContact(contact)}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Building className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first customer contact'
            }
          </p>
          {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
            <button
              onClick={onCreateContact}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactLog;