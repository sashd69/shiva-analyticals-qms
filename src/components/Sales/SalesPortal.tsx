import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Bell,
  Search,
  User,
  LogOut,
  FlaskConical,
  DollarSign,
  X,
  Target
} from 'lucide-react';
import ContactLog from './ContactLog';
import QuotationManager from './QuotationManager';
import SalesAnalytics from './SalesAnalytics';
import Header from '../Layout/Header';
import NewContactForm from './NewContactForm';
import NewQuoteForm from './NewQuoteForm';
import QuoteViewerModal from './QuoteViewerModal';
import QuoteEditorModal from './QuoteEditorModal';
import { NotificationContainer } from '../Common/Notification';
import TargetDashboard from './TargetDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { contactService, quoteService } from '../../services/database';
import { useNotifications } from '../../hooks/useNotifications';
import { downloadQuotePDF } from '../../utils/pdfGenerator';
import { mockMetrics, mockContacts } from '../../data/salesMockData';
import { CustomerContact } from '../../types';
import { saveQuotes, loadQuotes, saveContacts, loadContacts, getLastSavedTime } from '../../utils/localStorage';

const SalesPortal: React.FC = () => {
  const { state, logout, requireDepartmentSelection } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [showQuoteViewer, setShowQuoteViewer] = useState<any>(null);
  const [showQuoteEditor, setShowQuoteEditor] = useState<any>(null);
  const [showContactViewer, setShowContactViewer] = useState<CustomerContact | null>(null);
  const [showContactEditor, setShowContactEditor] = useState<CustomerContact | null>(null);
  const [currentTimeframe, setCurrentTimeframe] = useState<'weekly' | 'monthly' | 'quarterly' | 'annual'>('monthly');
  const [timeframeData, setTimeframeData] = useState(mockMetrics);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();

  // Check if department is selected
  useEffect(() => {
    if (state.user?.role === 'sales' && !state.selectedDepartment) {
      requireDepartmentSelection();
    }
  }, [state.user, state.selectedDepartment, requireDepartmentSelection]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'contacts', label: 'Contact Log', icon: Users },
    { id: 'quotes', label: 'Quotations', icon: FileText }, 
    { id: 'targets', label: 'My Targets', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Try to load data from localStorage first
      const savedContacts = loadContacts();
      const savedQuotes = loadQuotes();
      const lastSavedTime = getLastSavedTime();
      
      if (savedContacts.length > 0) {
        setContacts(savedContacts);
      } else {
        // Fall back to mock data if nothing in localStorage
        setContacts(mockContacts);
      }
      
      if (savedQuotes.length > 0) {
        setQuotes(savedQuotes);
      } else {
        // Fall back to mock data if nothing in localStorage
        const quotesData = await quoteService.getQuotes({ salesEmployeeId: state.user?.id });
        if (quotesData) {
          setQuotes(quotesData);
        }
      }
      
      if (lastSavedTime) {
        setLastSaved(lastSavedTime);
      }
      
      try {
        // If we have no saved data, try to fetch from API
        if (savedContacts.length === 0) {
          const contactsData = await contactService.getContacts(state.user?.id);
          if (contactsData) {
            setContacts(contactsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showError('Data Loading Error', 'Failed to load your sales data');
      }
    };
    
    if (state.isAuthenticated) {
      fetchData();
    }
  }, [state.isAuthenticated, state.user?.id, showError]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (contacts.length > 0) {
      saveContacts(contacts);
    }
    
    if (quotes.length > 0) {
      saveQuotes(quotes);
    }
    
    const newLastSaved = new Date().toISOString();
    setLastSaved(newLastSaved);
  }, [contacts, quotes]);

  const handleCreateContact = () => {
    setShowNewContactForm(true);
  };

  const handleViewContact = (contact: CustomerContact) => {
    setShowContactViewer(contact);
  };

  const handleEditContact = (contact: CustomerContact) => {
    setShowContactEditor(contact);
  };

  const handleSaveContact = async (contactData: any) => {
    // In a real app, this would make an API call
    try {
      console.log('Creating contact with data:', {
        salesEmployeeId: state.user?.id || '',
      });
      
      // Create a new contact with a generated ID and timestamps
      const newContact: CustomerContact = {
        id: `contact-${Date.now()}`,
        customerName: contactData.customerName,
        companyName: contactData.companyName,
        contactPerson: contactData.contactPerson,
        contactPosition: contactData.contactPosition || '',
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        progressStatus: contactData.progressStatus,
        ...contactData,
        salesEmployeeId: state.user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            id: `status-${Date.now()}`,
            fromStatus: null,
            toStatus: contactData.progressStatus,
            timestamp: new Date().toISOString(),
            notes: 'Initial contact created',
            changedBy: `${state.user?.firstName} ${state.user?.lastName}` || 'User'
          }
        ],
        notes: contactData.notes || '',
        priority: contactData.priority
      };
      
      // In a real app, this would be the API call
      // const newContact = await contactService.createContact({
      //   ...contactData,
      //   salesEmployeeId: state.user?.id || ''
      // });
      
      if (newContact) {
        // Update the contacts list with the new contact
        setContacts(prevContacts => [newContact, ...prevContacts]);
        // Save to localStorage
        saveContacts([newContact, ...contacts]);
        showSuccess('Contact Created', 'New contact has been added successfully');
        setShowNewContactForm(false);
      } else {
        showError('Error', 'Failed to create contact. Response was empty.');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      showError('Error', 'Failed to create contact. Please try again.');
    }
  };

  const handleUpdateContact = async (contactData: any) => {
    try {
      const updatedContact = await contactService.updateContact(contactData.id, contactData);

      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        ));
        // Save to localStorage
        saveContacts(contacts.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        ));
        showSuccess('Contact Updated', 'Contact information has been saved successfully');
        setShowContactEditor(null);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      showError('Error', 'Failed to update contact. Please try again.');
    }
  };


  const handleCreateQuote = () => {
    setShowNewQuoteForm(true);
  };

  const handleSaveQuote = async (quoteData: any) => {
    // In a real app, this would make an API call
    try {
      let updatedQuote;
      
      if (quoteData.id) {
        // Update existing quote
        updatedQuote = await quoteService.updateQuote(quoteData.id, quoteData);
        
        if (updatedQuote) {
          setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
          // Save to localStorage
          saveQuotes(quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q));
          showSuccess('Quote Updated', 'Quote has been updated successfully');
          setShowQuoteEditor(null);
        }
      } else {
        // Add department information to new quote
        const quoteWithDepartment = {
          ...quoteData,
          department: state.selectedDepartment,
          departmentId: state.selectedDepartment,
          salesEmployeeId: state.user?.id || ''
        };

        // Create a new quote with a generated ID
        const newQuote = {
          ...quoteWithDepartment,
          id: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          versionHistory: [],
          attachments: [],
          lastAutoSave: new Date().toISOString()
        };
        
        // In a real app, this would be the API call
        // const newQuote = await quoteService.createQuote(quoteWithDepartment);
        
        if (newQuote) {
          setQuotes(prev => [newQuote, ...prev]);
          // Save to localStorage
          saveQuotes([newQuote, ...quotes]);
          showSuccess('Quote Created', 'Quote has been created and saved successfully');
          setShowNewQuoteForm(false);
        }
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      showError('Error', 'Failed to save quote. Please try again.');
    }
  };

  const handleDeleteQuote = async (quote: any) => {
    try {
      // In a real app, this would make an API call
      setQuotes(prev => prev.filter(q => q.id !== quote.id));
      // Save to localStorage
      saveQuotes(quotes.filter(q => q.id !== quote.id));
      showSuccess('Quote Deleted', `Quote ${quote.id} has been deleted successfully`);
    } catch (error) {
      console.error('Error deleting quote:', error);
      showError('Error', 'Failed to delete quote. Please try again.');
    }
  };

  const handleDuplicateQuote = async (quote: any) => {
    try {
      const duplicatedQuote = {
        ...quote,
        id: `${quote.id}-COPY`,
        title: `${quote.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setQuotes(prev => [duplicatedQuote, ...prev]);
      // Save to localStorage
      saveQuotes([duplicatedQuote, ...quotes]);
      showSuccess('Quote Duplicated', `Quote ${quote.id} has been duplicated as ${duplicatedQuote.id}`);
    } catch (error) {
      console.error('Error duplicating quote:', error);
      showError('Error', 'Failed to duplicate quote. Please try again.');
    }
  };

  const handleCopyQuote = (quote: any) => {
    try {
      console.log('Copying quote:', quote.id);
      showSuccess('Quote Copied', `Quote ${quote.id} has been copied to clipboard`);
    } catch (error) {
      showError('Error', 'Failed to copy quote. Please try again.');
    }
  };

  const handleDownloadQuote = (quote: any) => {
    try {
      downloadQuotePDF(quote);
      showSuccess('Download Complete', `PDF for quote ${quote.id} has been downloaded`);
    } catch (error) {
      showError('Error', 'Failed to download quote. Please try again.');
    }
  };

  const handleViewQuote = (quote: any) => {
    // Open quote viewer modal
    setShowQuoteViewer(quote);
  };

  const handleEditQuote = (quote: any) => {
    // Open quote editor
    setShowQuoteEditor(quote);
  };

  const handleAutoSave = async (quoteId: string, data: any) => {
    // Auto-save functionality
    try {
      // Only attempt to save if we have a valid quote ID
      if (quoteId) {
        const result = await quoteService.updateQuoteStatus(quoteId, 'draft');
        
        if (result) {
          console.log('Auto-saving quote:', quoteId);
          
          // Update the quote in state
          const updatedQuotes = quotes.map(q => 
            q.id === quoteId ? { ...q, lastAutoSave: new Date().toISOString() } : q
          );
          setQuotes(updatedQuotes);
          
          // Save to localStorage
          saveQuotes(updatedQuotes);
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't rethrow error to prevent app crashes
    }
  };

  const handleExportReport = (format: 'excel' | 'pdf') => {
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  const handleExportTargetReport = (format: 'excel' | 'pdf') => {
    showSuccess('Export Started', `Target report is being exported as ${format.toUpperCase()}...`);
  };

  const generateTimeframeData = (timeframe: 'weekly' | 'monthly' | 'quarterly' | 'annual') => {
    setCurrentTimeframe(timeframe);
    
    // Generate mock data based on the selected timeframe
    let newData;
    
    if (timeframe === 'weekly') {
      newData = {
        ...mockMetrics,
        period: 'weekly' as const,
        monthlyTrend: [
          { month: 'Week 1', contacts: 32, quotes: 8, revenue: 3842000, conversionRate: 61.5 },
          { month: 'Week 2', contacts: 38, quotes: 10, revenue: 4126000, conversionRate: 63.2 },
          { month: 'Week 3', contacts: 41, quotes: 12, revenue: 5215000, conversionRate: 65.7 },
          { month: 'Week 4', contacts: 45, quotes: 14, revenue: 5832000, conversionRate: 68.1 }
        ]
      };
    } else if (timeframe === 'quarterly') {
      newData = {
        ...mockMetrics,
        period: 'quarterly' as const,
        monthlyTrend: [
          { month: 'Q1', contacts: 423, quotes: 115, revenue: 54482000, conversionRate: 62.5 },
          { month: 'Q2', contacts: 466, quotes: 135, revenue: 62984000, conversionRate: 66.7 },
          { month: 'Q3', contacts: 525, quotes: 145, revenue: 71983000, conversionRate: 68.1 }
        ]
      };
    } else {
      // Default to the original monthly data
      newData = mockMetrics;
    }
    
    // Update the state with the new data
    setTimeframeData(newData);
  };

  const calculateMetrics = () => {
    // Calculate metrics based on actual data
    const totalContacts = contacts.length;
    const totalQuotes = quotes.length;
    const closedWonContacts = contacts.filter(c => c.progressStatus === 'closed_won').length;
    const conversionRate = totalContacts > 0 ? (closedWonContacts / totalContacts) * 100 : 0;
    const totalRevenue = quotes.reduce((sum, quote) => sum + quote.finalAmount, 0);
    const averageQuoteValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;
    
    // Create a progress breakdown object
    const progressBreakdown: any = {
      initial_call: 0,
      offline_meeting: 0,
      quotation_phase: 0,
      negotiation: 0,
      closed_won: 0,
      closed_lost: 0
    };
    
    contacts.forEach(contact => {
      if (progressBreakdown[contact.progressStatus] !== undefined) {
        progressBreakdown[contact.progressStatus]++;
      }
    });
    
    return {
      period: currentTimeframe,
      totalContacts, 
      totalQuotes, 
      conversionRate, 
      totalRevenue, 
      averageQuoteValue, 
      progressBreakdown,
      monthlyTrend: timeframeData.monthlyTrend,
      convertedQuotes: closedWonContacts
    };
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-black rounded-xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {state.user?.firstName}!</h1>
              <p className="text-gray-300 text-lg">
                Here's your sales activity overview for today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-black" />
                  <span className="text-green-600 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">156</h3>
                <p className="text-gray-600">Total Contacts</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-black" />
                  <span className="text-green-600 text-sm font-medium">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">42</h3>
                <p className="text-gray-600">Active Quotes</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-black" />
                  <span className="text-green-600 text-sm font-medium">+15%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">68.5%</h3>
                <p className="text-gray-600">Conversion Rate</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-black" />
                  <span className="text-green-600 text-sm font-medium">+22%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">₹2.04Cr</h3>
                <p className="text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <ContactLog
            contacts={contacts}
            contacts={contacts}
            onCreateContact={handleCreateContact}
            onEditContact={handleEditContact}
            onViewContact={handleViewContact}
          />
        );
      case 'quotes':
        return (
          <QuotationManager
            quotes={quotes}
            onCreateQuote={handleCreateQuote}
            onViewQuote={handleViewQuote}
            onEditQuote={handleEditQuote}
            onDeleteQuote={handleDeleteQuote}
            onDuplicateQuote={handleDuplicateQuote}
            onAutoSave={handleAutoSave}
            onCopyQuote={handleCopyQuote}
            onDownloadQuote={handleDownloadQuote}
          />
        );
      case 'analytics':
        return (
          <SalesAnalytics
            metrics={calculateMetrics()}
            onExportReport={handleExportReport}
            onGenerateTimeframeData={generateTimeframeData}
          />
        );
      case 'targets':
        return (
          <TargetDashboard
            onExportReport={handleExportTargetReport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Sales Portal"
        onNavigateHome={() => setActiveSection('dashboard')}
        selectedDepartment={state.selectedDepartment}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <main className="mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
          
          {/* Last Saved Indicator */}
          {lastSaved && (
            <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs opacity-70">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          
          {/* Contact Editor Modal */}
          {showContactEditor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Edit Contact</h2>
                      <p className="text-gray-600">Update contact information</p>
                    </div>
                    <button
                      onClick={() => setShowContactEditor(null)}
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
                          value={showContactEditor.customerName}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, customerName: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={showContactEditor.companyName}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={showContactEditor.contactPerson}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, contactPerson: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={showContactEditor.contactPosition}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, contactPosition: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={showContactEditor.email}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={showContactEditor.phone}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={showContactEditor.address}
                        onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, address: e.target.value } : null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={showContactEditor.progressStatus}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, progressStatus: e.target.value as any } : null)}
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
                          value={showContactEditor.priority}
                          onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
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
                        value={showContactEditor.notes}
                        onChange={(e) => setShowContactEditor(prev => prev ? { ...prev, notes: e.target.value } : null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-6 border-t mt-6">
                    <button
                      onClick={() => handleUpdateContact(showContactEditor)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowContactEditor(null)}
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
      </main>

      {/* Modal Forms */}
      <NewContactForm
        isOpen={showNewContactForm}
        onClose={() => setShowNewContactForm(false)}
        onSave={handleSaveContact}
      />
      
      <NewQuoteForm
        isOpen={showNewQuoteForm}
        onClose={() => setShowNewQuoteForm(false)}
        contacts={contacts}
        onSave={handleSaveQuote}
      />
      
      {/* Quote Viewer Modal */}
      {showQuoteViewer && (
        <QuoteViewerModal
          quote={showQuoteViewer}
          onClose={() => setShowQuoteViewer(null)}
        />
      )}
      
      {/* Quote Editor Modal */}
      {showQuoteEditor && (
        <QuoteEditorModal
          quote={showQuoteEditor}
          onClose={() => setShowQuoteEditor(null)}
          onSave={handleSaveQuote}
        />
      )}

      {/* Contact Viewer Modal */}
      {showContactViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                  <p className="text-gray-600">{showContactViewer.customerName}</p>
                </div>
                <button
                  onClick={() => setShowContactViewer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Customer:</span> {showContactViewer.customerName}</div>
                    <div><span className="text-gray-600">Company:</span> {showContactViewer.companyName}</div>
                    <div><span className="text-gray-600">Email:</span> {showContactViewer.email}</div>
                    <div><span className="text-gray-600">Phone:</span> {showContactViewer.phone}</div>
                    <div><span className="text-gray-600">Address:</span> {showContactViewer.address}</div>
                    <div><span className="text-gray-600">Department:</span> {state.selectedDepartment}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Person</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {showContactViewer.contactPerson}</div>
                    <div><span className="text-gray-600">Position:</span> {showContactViewer.contactPosition}</div>
                    <div><span className="text-gray-600">Priority:</span> {showContactViewer.priority}</div>
                    <div><span className="text-gray-600">Status:</span> {showContactViewer.progressStatus.replace('_', ' ').toUpperCase()}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Status History</h3>
                <div className="space-y-3">
                  {showContactViewer.statusHistory.map((history) => (
                    <div key={history.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">
                          {history.fromStatus ? `${history.fromStatus.replace('_', ' ').toUpperCase()} → ` : ''}
                          {history.toStatus.replace('_', ' ').toUpperCase()}
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

              {showContactViewer.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{showContactViewer.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowContactViewer(null);
                    handleEditContact(showContactViewer);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit Contact
                </button>
                <button
                  onClick={() => setShowContactViewer(null)}
                  className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

export default SalesPortal;