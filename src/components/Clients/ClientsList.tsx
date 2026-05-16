import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { Client } from '../../types';

interface ClientsListProps {
  clients: Client[];
  onCreateClient: () => void;
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  onCreateClient, 
  onViewClient, 
  onEditClient 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Client['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage your laboratory service clients and their information</p>
        </div>
        <button
          onClick={onCreateClient}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, company, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <span>{client.address}</span>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-500 mb-1">Contact Person</div>
              <div className="font-medium text-gray-900">{client.contactPerson}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <FileText className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-lg font-bold text-gray-900">{client.totalQuotes}</span>
                </div>
                <div className="text-xs text-gray-500">Total Quotes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-lg font-bold text-gray-900">
                    ${(client.totalValue / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="text-xs text-gray-500">Total Value</div>
              </div>
            </div>

            {/* Client Since */}
            <div className="text-xs text-gray-500 mb-4">
              Client since {new Date(client.createdAt).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onViewClient(client)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </button>
              <button
                onClick={() => onEditClient(client)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Building className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by adding your first client'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button
              onClick={onCreateClient}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Client
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsList;