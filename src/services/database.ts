import { generateUuidV4 } from '../utils/uuid';
import { supabase } from '../lib/supabase';
import { mockTests } from '../data/mockData';
import { mockContacts, mockQuotes } from '../data/salesMockData';
import { mockSampleHistory, mockComplaints } from '../data/supportMockData';
import { 
  CustomerContact, 
  Quote, 
  LaboratoryTest, 
  User,
  SampleRecord,
  Complaint
} from '../types';

// Authentication Services
export const authService = {
  async signUp(email: string, password: string, userData: any): Promise<any> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      // Mocked response
      return { user: { id: '123', email }, session: null };
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Failed to sign up');
    }
    return null;
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Mocked response
      return { user: { id: '123', email }, session: { access_token: 'mock-token' } };
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Failed to sign in');
    }
    return null;
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      // Mocked user profile
      return {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'sales'
      };
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};

// Customer Contact Services
export const contactService = {
  async getContacts(salesEmployeeId?: string): Promise<CustomerContact[]> {
    return mockContacts;
  },

  async createContact(contactData: Omit<CustomerContact, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<CustomerContact | null> {
    try {
      console.log('Database service creating contact with data:', contactData);
      
      // Ensure UUID format for sales_employee_id
      if (!contactData.salesEmployeeId || typeof contactData.salesEmployeeId === 'undefined') {
        throw new Error('Sales employee ID is required');
      }

      // Create a new contact with mock data
      const newContact: CustomerContact = {
        id: generateUuidV4(),
        customerName: contactData.customerName,
        companyName: contactData.companyName,
        contactPerson: contactData.contactPerson,
        contactPosition: contactData.contactPosition || '',
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        progressStatus: contactData.progressStatus,
        priority: contactData.priority,
        notes: contactData.notes || '',
        salesEmployeeId: contactData.salesEmployeeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: []
      };
      return newContact;
    } catch (error) {
      console.error('Contact creation failed:', error);
      return null;
    }
  },

  async updateContact(contactId: string, updates: Partial<CustomerContact>) {
    try {
      // For mock implementation, find and update the contact in the mock data
      const contactIndex = mockContacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }
      
      // Update the contact
      const updatedContact = {
        ...mockContacts[contactIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Update the mock data
      mockContacts[contactIndex] = updatedContact;
      
      console.log('Contact updated:', updatedContact);
      return updatedContact;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }
};

// Quote Services
export const quoteService = {
  getQuotes(filters: any = {}): Promise<Quote[]> {
    return Promise.resolve(mockQuotes);
  },

  createQuote(quoteData: any) {
    try {
      // Create a new quote with mock data
      const newQuote = {
        ...quoteData,
        id: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        versionHistory: [],
        attachments: [],
        lastAutoSave: new Date().toISOString()
      };
      return Promise.resolve(newQuote);
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  updateQuote(quoteId: string, updates: Partial<Quote>) {
    try {
      // Find the quote in mock data
      const quoteIndex = mockQuotes.findIndex(q => q.id === quoteId);
      if (quoteIndex === -1) {
        throw new Error('Quote not found');
      }
      
      // Update the quote
      const updatedQuote = {
        ...mockQuotes[quoteIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Update the mock data
      mockQuotes[quoteIndex] = updatedQuote;
      
      console.log('Quote updated:', updatedQuote);
      return Promise.resolve(updatedQuote);
    } catch (error) {
      handleSupabaseError(error);
      return Promise.reject(error);
    }
  },

  updateQuoteStatus(quoteId: string, status: string, approver?: string) {
    try {
      // Mock update quote status
      const updatedQuote = mockQuotes.find(q => q.id === quoteId);
      if (updatedQuote) {
        updatedQuote.status = status as any;
        updatedQuote.updatedAt = new Date().toISOString();
        if (approver) {
          updatedQuote.approver = approver;
        }
      }
      return Promise.resolve(updatedQuote);
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Laboratory Test Services
export const testService = {
  async getTests(filters: any = {}): Promise<LaboratoryTest[]> {
    try {
      return mockTests.map(test => ({
        ...test
      })) || [];
    } catch (error) {
      console.error('Error fetching tests:', error);
      return [];
    }
  },

  async createTest(testData: Omit<LaboratoryTest, 'id'>) {
    /*try {
      const { data, error } = await supabase
        .from('laboratory_tests')
        .insert({
          name: testData.name,
          category: testData.category,
          subcategory: testData.subcategory,
          description: testData.description,
          unit_price: testData.unitPrice,
          turnaround_time: testData.turnaroundTime,
          accreditation: testData.accreditation,
          methodology: testData.methodology,
          sample_requirements: testData.sampleRequirements,
          popularity: testData.popularity
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await logAuditEvent('TEST_CREATED', 'Admin', { testId: data.id });
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }*/
    return null;
  }
};

// Sample Services
export const sampleService = {
  async getSampleRecords(quoteId?: string): Promise<any[]> {
    try {
      /*let query = supabase
        .from('sample_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (quoteId) {
        query = query.eq('quote_id', quoteId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      */
      return mockSampleHistory || [];
    } catch (error) {
      console.error('Error getting sample records:', error);
      handleSupabaseError(error);
    }
  },

  async createSampleRecord(sampleData: Omit<SampleRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const { data, error } = await supabase
        .from('sample_records')
        .insert({
          quote_id: sampleData.quoteId,
          sample_type: sampleData.sampleType,
          original_quantity: sampleData.originalQuantity,
          actual_sample_value: sampleData.actualSampleValue,
          samples_received: sampleData.samplesReceived,
          date_received: sampleData.dateReceived,
          received_by: sampleData.receivedBy,
          notes: sampleData.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await logAuditEvent('SAMPLE_RECORDED', 'Support', { sampleId: data.id });
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Complaint Services
export const complaintService = {
  async getComplaints(filters: any = {}): Promise<Complaint[]> {
    try {
      return mockComplaints;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async createComplaint(complaintData: any) {
    try {
      /*// Generate ticket number
      const { data: ticketNumber, error: ticketError } = await supabase
        .rpc('generate_ticket_number');
      
      if (ticketError) throw ticketError;
      
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          ticket_number: ticketNumber,
          customer_name: complaintData.customerName,
          customer_email: complaintData.customerEmail,
          customer_phone: complaintData.customerPhone,
          complaint_description: complaintData.complaintDescription,
          priority: complaintData.priority,
          status: complaintData.status,
          related_quote_id: complaintData.relatedQuoteId,
          assigned_to: complaintData.assignedTo,
          assigned_by: complaintData.assignedBy
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await logAuditEvent('COMPLAINT_CREATED', 'Support', { complaintId: data.id });
      return data;*/
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async updateComplaintStatus(complaintId: string, status: string, notes?: string) {
    try {
      /*const updates: any = { status };
      
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
        updates.resolution_notes = notes;
      }
      
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', complaintId)
        .select()
        .single();
      
      if (error) throw error;
      
      await logAuditEvent('COMPLAINT_STATUS_UPDATED', 'Support', { complaintId, status });
      return data;*/
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// User Management Services (Admin)
export const userService = {
  /*async getUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments:department_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        department: user.departments?.name || 'Unknown'
      })) || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },*/

  async createUser(userData: any) {
    try {
      // This would typically involve inviting the user through Supabase Auth
      // For now, we'll create a profile entry assuming the user will be created
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          username: userData.username,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department_id: userData.departmentId,
          is_active: userData.isActive
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // await logAuditEvent('USER_CREATED', 'Admin', { userId: data.id });
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async updateUser(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          email: updates.email,
          first_name: updates.firstName,
          last_name: updates.lastName,
          role: updates.role,
          department_id: updates.departmentId,
          is_active: updates.isActive
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // await logAuditEvent('USER_UPDATED', 'Admin', { userId });
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      // await logAuditEvent('USER_DELETED', 'Admin', { userId });
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Utility functions to replace Supabase functions
export const handleSupabaseError = (error: any) => {
  console.error('Database error:', error);
  // Don't throw error in mock implementation to prevent app crashes
  return null;
};
