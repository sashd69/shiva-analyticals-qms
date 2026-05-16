import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  User, 
  Building, 
  Calendar,
  Phone,
  Mail,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { CustomerContact } from '../../types';

interface ContactLogViewerProps {
  contacts: CustomerContact[];
  onUpdateContact: (contact: CustomerContact) => void;
}

const ContactLogViewer: React.FC<ContactLogViewerProps> = ({ contacts, onUpdateContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingContact, setViewingContact] = useState<CustomerContact | null>(null);
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null);
  const [editForm, setEditForm] = useState<CustomerContact | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.progressStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      initial_call: 'bg-blue-100 text-blue-800',
      offline_meeting: 'bg-amber-100 text-amber-800',
      quotation_phase: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      initial_call: 'Initial Call',
      offline_meeting: 'Offline Meeting',
      quotation_phase: 'Quotation Phase',
      negotiation: 'Negotiation',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost'
    };
    return labels[status] || status;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editForm?.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!editForm?.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!editForm?.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!editForm?.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!editForm?.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!editForm || !validateForm()) {
      return;
    }

    const updatedContact = {
      ...editForm,
      updatedAt: new Date().toISOString()
    };

    onUpdateContact(updatedContact);
    setEditingContact(null);
    setEditForm(null);
    setErrors({});
  };

  const handleEditClick = (contact: CustomerContact) => {
    setEditingContact(contact);
    setEditForm({ ...contact });
  };

  const formatCallSummary = (contact: CustomerContact) => {
    const lastStatus = contact.statusHistory[contact.statusHistory.length - 1];
    return lastStatus?.notes || `${getStatusLabel(contact.progressStatus)} - Contact established`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Log Management</h1>
          <p className="text-gray-600 mt-1">View and manage customer contact logs and call history</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or contact person..."
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
              <option value="initial_call">Initial Call</option>
              <option value="offline_meeting">Offline Meeting</option>
              <option value="quotation_phase">Quotation Phase</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Contact Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Customer Details</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Contact Person</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Call Summary</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(contact.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(contact.updatedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Building className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{contact.customerName}</div>
                        <div className="text-sm text-gray-600">{contact.companyName}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{contact.contactPerson}</div>
                        <div className="text-sm text-gray-600">{contact.contactPosition}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {formatCallSummary(contact)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Priority: {contact.priority}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.progressStatus)}`}>
                      {getStatusLabel(contact.progressStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setViewingContact(contact)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(contact)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Contact Modal */}
      {viewingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                  <p className="text-gray-600">{viewingContact.customerName}</p>
                </div>
                <button
                  onClick={() => setViewingContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Customer:</span> {viewingContact.customerName}</div>
                    <div><span className="text-gray-600">Company:</span> {viewingContact.companyName}</div>
                    <div><span className="text-gray-600">Email:</span> {viewingContact.email}</div>
                    <div><span className="text-gray-600">Phone:</span> {viewingContact.phone}</div>
                    <div><span className="text-gray-600">Address:</span> {viewingContact.address}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Person</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {viewingContact.contactPerson}</div>
                    <div><span className="text-gray-600">Position:</span> {viewingContact.contactPosition}</div>
                    <div><span className="text-gray-600">Priority:</span> {viewingContact.priority}</div>
                    <div><span className="text-gray-600">Status:</span> {getStatusLabel(viewingContact.progressStatus)}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Status History</h3>
                <div className="space-y-3">
                  {viewingContact.statusHistory.map((history) => (
                    <div key={history.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">
                          {history.fromStatus ? `${getStatusLabel(history.fromStatus)} → ` : ''}
                          {getStatusLabel(history.toStatus)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-700">{history.notes}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Changed by: {history.changedBy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewingContact.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{viewingContact.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setViewingContact(null);
                    handleEditClick(viewingContact);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit Contact
                </button>
                <button
                  onClick={() => setViewingContact(null)}
                  className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Contact</h2>
                  <p className="text-gray-600">Modify contact information and status</p>
                </div>
                <button
                  onClick={() => {
                    setEditingContact(null);
                    setEditForm(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.customerName}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, customerName: e.target.value } : null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.customerName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.customerName && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.customerName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.companyName && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.companyName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.contactPerson}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, contactPerson: e.target.value } : null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.contactPerson ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.contactPerson && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactPerson}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Position
                    </label>
                    <input
                      type="text"
                      value={editForm.contactPosition}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, contactPosition: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, address: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress Status
                    </label>
                    <select
                      value={editForm.progressStatus}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, progressStatus: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="initial_call">Initial Call</option>
                      <option value="offline_meeting">Offline Meeting</option>
                      <option value="quotation_phase">Quotation Phase</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this contact..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingContact(null);
                    setEditForm(null);
                    setErrors({});
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactLogViewer;