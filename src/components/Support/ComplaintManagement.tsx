import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  User, 
  AlertCircle,
  Clock,
  CheckCircle,
  X,
  Paperclip,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';
import { Complaint } from '../../types';

interface ComplaintManagementProps {
  complaints: Complaint[];
  onCreateComplaint: (complaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  onUpdateComplaintStatus: (complaintId: string, status: string, notes?: string) => void;
  onAssignComplaint: (complaintId: string, assignedTo: string) => void;
}

const ComplaintManagement: React.FC<ComplaintManagementProps> = ({
  complaints,
  onCreateComplaint,
  onUpdateComplaintStatus,
  onAssignComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    complaintDescription: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    relatedQuoteId: '',
    assignedTo: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  // Mock sales employees for assignment
  const salesEmployees = [
    { id: '1', name: 'Sarah Johnson', department: 'Food and agriculture' },
    { id: '2', name: 'Michael Chen', department: 'Ores and minerals' },
    { id: '3', name: 'David Rodriguez', department: 'Materials' },
    { id: '4', name: 'Emma Wilson', department: 'Environmental' },
    { id: '5', name: 'Lisa Anderson', department: 'Pharmaceutical' }
  ];

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complaintDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-amber-100 text-amber-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-purple-100 text-purple-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-amber-100 text-amber-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaintData: any = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      complaintDescription: formData.complaintDescription,
      priority: formData.priority,
      status: 'open' as const,
      relatedQuoteId: formData.relatedQuoteId || undefined,
      assignedTo: formData.assignedTo || undefined,
      assignedBy: 'Emma Wilson', // Current user
      attachments: attachments.map((file, index) => ({
        id: `temp-${index}`,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Emma Wilson',
        url: URL.createObjectURL(file)
      }))
    };

    onCreateComplaint(complaintData);
    setShowCreateForm(false);

    // Reset form
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      complaintDescription: '',
      priority: 'medium',
      relatedQuoteId: '',
      assignedTo: ''
    });
    setAttachments([]);
    setShowCreateForm(false);
  };

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    const notes = prompt('Add notes for status change (optional):');
    onUpdateComplaintStatus(complaintId, newStatus, notes || undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-gray-600 mt-1">Track and resolve customer complaints and issues</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
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
                placeholder="Search complaints by customer, ticket number, or description..."
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid gap-6">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{complaint.ticketNumber}</h3>
                  <p className="text-sm text-gray-600">{complaint.customerName}</p>
                  <p className="text-xs text-gray-500">{complaint.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(complaint.status)}`}>
                  {getStatusIcon(complaint.status)}
                  <span className="ml-1">{complaint.status.replace('_', ' ').toUpperCase()}</span>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Complaint Description</h4>
              <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{complaint.complaintDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Created: {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
              {complaint.relatedQuoteId && (
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Quote: {complaint.relatedQuoteId}
                </div>
              )}
              {complaint.assignedTo && (
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Assigned: {complaint.assignedTo}
                </div>
              )}
            </div>

            {complaint.attachments.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Paperclip className="h-4 w-4 mr-1" />
                  {complaint.attachments.length} attachment{complaint.attachments.length !== 1 ? 's' : ''}
                </div>
                <div className="flex flex-wrap gap-2">
                  {complaint.attachments.map((attachment) => (
                    <span key={attachment.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {attachment.filename}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedComplaint(complaint)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {complaint.status !== 'closed' && (
                  <>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={complaint.assignedTo || ''}
                      onChange={(e) => onAssignComplaint(complaint.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="">Unassigned</option>
                      {salesEmployees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No complaints have been filed yet'
            }
          </p>
        </div>
      )}

      {/* Create Complaint Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Complaint</h2>
                  <p className="text-gray-600 mt-1">Log a new customer complaint or issue</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Related Quote ID
                      </label>
                      <input
                        type="text"
                        value={formData.relatedQuoteId}
                        onChange={(e) => setFormData(prev => ({ ...prev, relatedQuoteId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Q-2024-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complaint Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.complaintDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, complaintDescription: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the complaint in detail..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign to Sales Employee
                      </label>
                      <select
                        value={formData.assignedTo}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        {salesEmployees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name} - {emp.department}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* File Attachments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Evidence Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Click to upload files or drag and drop</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <label htmlFor="file-upload" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200">
                        Choose Files
                      </label>
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Create Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedComplaint.ticketNumber}</h2>
                  <p className="text-gray-600">{selectedComplaint.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Name:</span> {selectedComplaint.customerName}</div>
                      <div><span className="text-gray-600">Email:</span> {selectedComplaint.customerEmail}</div>
                      <div><span className="text-gray-600">Phone:</span> {selectedComplaint.customerPhone}</div>
                      {selectedComplaint.relatedQuoteId && (
                        <div><span className="text-gray-600">Related Quote:</span> {selectedComplaint.relatedQuoteId}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complaint Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                          {selectedComplaint.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                          {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {selectedComplaint.assignedTo && (
                        <div><span className="text-gray-600">Assigned to:</span> {selectedComplaint.assignedTo}</div>
                      )}
                      <div><span className="text-gray-600">Created:</span> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complaint Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedComplaint.complaintDescription}</p>
                  </div>
                </div>

                {selectedComplaint.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Attachments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedComplaint.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{attachment.filename}</div>
                            <div className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;