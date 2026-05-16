import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FlaskConical,
  Plus,
  MessageSquare,
  Package as PackageIcon,
  User
} from 'lucide-react';
import SampleAnalysis from './SampleAnalysis';
import ComplaintManagement from './ComplaintManagement';
import Header from '../Layout/Header';
import { useAuth } from '../../contexts/AuthContext';
import { SampleRecord, Complaint, SampleHistory } from '../../types';
import { sampleService, complaintService } from '../../services/database';
import { NotificationContainer } from '../Common/Notification';
import { mockContacts } from '../../data/salesMockData';
import { useNotifications } from '../../hooks/useNotifications';

const Flask = FlaskConical;

const SupportPortal: React.FC = () => {
  const { state, logout, requireDepartmentSelection } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [samples, setSamples] = useState<SampleHistory[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [contacts, setContacts] = useState<any[]>(mockContacts);
  const [loading, setLoading] = useState(false);
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  
  // Check if department is selected
  useEffect(() => {
    if (state.user?.role === 'support' && !state.selectedDepartment) {
      requireDepartmentSelection();
    }
  }, [state.user, state.selectedDepartment, requireDepartmentSelection]);
  
  // Fetch data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get sample records
        const sampleData = await sampleService.getSampleRecords();
        if (sampleData) {
          // Group samples by quote ID to create SampleHistory objects
          const samplesByQuote = sampleData.reduce((acc, sample) => {
            if (!acc[sample.quote_id]) {
              acc[sample.quote_id] = [];
            }
            acc[sample.quote_id].push({
              id: sample.id,
              quoteId: sample.quote_id,
              sampleType: sample.sample_type,
              originalQuantity: sample.original_quantity,
              actualSampleValue: sample.actual_sample_value,
              samplesReceived: sample.samples_received,
              dateReceived: sample.date_received,
              receivedBy: sample.received_by,
              notes: sample.notes,
              createdAt: sample.created_at,
              updatedAt: sample.updated_at
            });
            return acc;
          }, {} as Record<string, SampleRecord[]>);
          
          // Convert to SampleHistory array
          const sampleHistory = Object.entries(samplesByQuote).map(([quoteId, records]) => ({
            id: `SH-${quoteId}`,
            quoteId,
            sampleRecords: records,
            totalSamplesReceived: records.reduce((sum, record) => sum + (record.samplesReceived || 0), 0),
            lastUpdated: records.sort((a, b) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )[0]?.updatedAt || new Date().toISOString()
          }));
          
          setSamples(sampleHistory);
        }
        
        // Get complaints
        const complaintData = await complaintService.getComplaints();
        if (complaintData) {
          setComplaints(complaintData);
        }
        
      } catch (error) {
        console.error('Error fetching support data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'samples', label: 'Sample Analysis', icon: FlaskConical },
    { id: 'complaints', label: 'Complaint Management', icon: MessageSquare }
  ];

  const handleSaveSampleDetails = (quoteId: string, sampleData: Omit<SampleRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Saving sample details for quote:', quoteId, sampleData);
    
    try {
      // Create a new sample record
      const newSampleRecord: SampleRecord = {
        id: `SR-${Date.now()}`,
        quoteId,
        sampleType: sampleData.sampleType,
        originalQuantity: sampleData.originalQuantity,
        actualSampleValue: sampleData.actualSampleValue,
        samplesReceived: sampleData.samplesReceived,
        dateReceived: sampleData.dateReceived,
        receivedBy: sampleData.receivedBy || `${state.user?.firstName} ${state.user?.lastName}`,
        notes: sampleData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    
      // Find if there's an existing sample history for this quote
      const existingSampleHistoryIndex = samples.findIndex(s => s.quoteId === quoteId);

      if (existingSampleHistoryIndex >= 0) {
        // Update existing sample history
        const updatedSamples = [...samples];
        updatedSamples[existingSampleHistoryIndex] = {
          ...updatedSamples[existingSampleHistoryIndex],
          sampleRecords: [...updatedSamples[existingSampleHistoryIndex].sampleRecords, newSampleRecord],
          totalSamplesReceived: updatedSamples[existingSampleHistoryIndex].totalSamplesReceived + newSampleRecord.samplesReceived,
          lastUpdated: new Date().toISOString()
        };
        setSamples(updatedSamples);
      } else {
        // Create new sample history
        const newSampleHistory: SampleHistory = {
          id: `SH-${quoteId}`,
          quoteId,
          sampleRecords: [newSampleRecord],
          totalSamplesReceived: newSampleRecord.samplesReceived,
          lastUpdated: new Date().toISOString()
        };
        setSamples([...samples, newSampleHistory]);
      }
    
      showSuccess('Sample analysis saved successfully!');
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error saving sample details:', error);
      showError('Failed to save sample analysis');
      return Promise.reject(error);
    }
  };

  const handleCreateComplaint = (complaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    console.log('Creating complaint:', complaintData);
    
    // Create a new complaint with generated ID and timestamps
    const newComplaint: Complaint = {
      id: `C-${Date.now()}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerName: complaintData.customerName,
      customerEmail: complaintData.customerEmail,
      customerPhone: complaintData.customerPhone,
      complaintDescription: complaintData.complaintDescription,
      priority: complaintData.priority,
      status: complaintData.status,
      relatedQuoteId: complaintData.relatedQuoteId,
      assignedTo: complaintData.assignedTo,
      assignedBy: complaintData.assignedBy || `${state.user?.firstName} ${state.user?.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: complaintData.attachments || [],
      statusHistory: [
        {
          id: `SH-${Date.now()}`,
          fromStatus: '',
          toStatus: 'open',
          timestamp: new Date().toISOString(),
          changedBy: `${state.user?.firstName} ${state.user?.lastName}`,
          notes: 'Complaint created'
        }
      ]
    };
    
    // Add the new complaint to the state
    setComplaints(prev => [newComplaint, ...prev]);
    
    showSuccess('Complaint created successfully!');
  };

  const handleUpdateComplaintStatus = (complaintId: string, status: string, notes?: string) => {
    console.log('Updating complaint status:', complaintId, status, notes);
    showSuccess('Complaint status updated successfully!');
  };

  const handleAssignComplaint = (complaintId: string, assignedTo: string) => {
    console.log('Assigning complaint:', complaintId, assignedTo);
    showSuccess('Complaint assigned successfully!');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-black rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Support Dashboard</h1>
        <p className="text-gray-300 text-lg">
          Customer support and system assistance overview
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <PackageIcon className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+5 today</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">18</h3>
          <p className="text-gray-600">Sample Records</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="h-8 w-8 text-black" />
            <span className="text-amber-600 text-sm font-medium">2 urgent</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">12</h3>
          <p className="text-gray-600">Active Complaints</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Flask className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">96.8%</h3>
          <p className="text-gray-600">Sample Accuracy</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <User className="h-8 w-8 text-black" />
            <span className="text-green-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
          <p className="text-gray-600">Customer Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sample Activities</h3>
          <div className="space-y-3">
            {samples.slice(0, 3).map((sample) => (
              <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Quote {sample.quoteId}</div>
                  <div className="text-sm text-gray-600">{sample.totalSamplesReceived} samples processed</div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(sample.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{complaint.ticketNumber}</div>
                  <div className="text-sm text-gray-600">{complaint.customerName}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' : complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                    {complaint.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'samples':
        return (
          <SampleAnalysis
            samples={samples}
            department={state.selectedDepartment || ''}
            contacts={contacts}
            onSaveSampleDetails={handleSaveSampleDetails}
          />
        );
      case 'complaints':
        return (
          <ComplaintManagement
            complaints={complaints}
            onCreateComplaint={handleCreateComplaint}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
            onAssignComplaint={handleAssignComplaint}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Support Portal"
        onNavigateHome={() => setActiveSection('dashboard')}
        selectedDepartment={state.selectedDepartment}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <main className="mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

export default SupportPortal;