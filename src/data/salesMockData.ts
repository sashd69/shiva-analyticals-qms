import { CustomerContact, Quote, SalesMetrics, MonthlyData } from '../types';

export const mockContacts: CustomerContact[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    customerName: 'Apollo Hospital Delhi',
    companyName: 'Apollo Hospitals Enterprise',
    contactPerson: 'Dr. Sarah Johnson',
    contactPosition: 'Chief of Laboratory',
    email: 'sarah.johnson@apollodelhi.com',
    phone: '+91 11 2692 5858',
    address: 'Sarita Vihar, Mathura Road, New Delhi, Delhi 110076',
    progressStatus: 'quotation_phase',
    salesEmployeeId: '550e8400-e29b-41d4-a716-446655440100',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
    statusHistory: [
      {
        id: '1',
        fromStatus: null,
        toStatus: 'initial_call',
        timestamp: '2024-02-15T09:00:00Z',
        notes: 'Initial contact made',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '2',
        fromStatus: 'initial_call',
        toStatus: 'offline_meeting',
        timestamp: '2024-02-20T11:00:00Z',
        notes: 'Scheduled in-person meeting',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '3',
        fromStatus: 'offline_meeting',
        toStatus: 'quotation_phase',
        timestamp: '2024-03-01T14:30:00Z',
        notes: 'Meeting successful, requesting quotation',
        changedBy: 'Sarah Johnson'
      }
    ],
    notes: 'Large healthcare system looking for comprehensive laboratory services. Interested in bulk testing packages. Focus on Food and agriculture testing.',
    priority: 'high'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    customerName: 'Fortis Hospital Mumbai',
    companyName: 'Fortis Healthcare Limited',
    contactPerson: 'Maria Rodriguez',
    contactPosition: 'Operations Manager',
    email: 'maria.rodriguez@fortismumbai.com',
    phone: '+91 22 6754 1000',
    address: 'Mulund Goregaon Link Road, Mulund West, Mumbai, Maharashtra 400078',
    progressStatus: 'offline_meeting',
    salesEmployeeId: '550e8400-e29b-41d4-a716-446655440100',
    createdAt: '2024-02-20T10:15:00Z',
    updatedAt: '2024-02-25T16:20:00Z',
    statusHistory: [
      {
        id: '4',
        fromStatus: null,
        toStatus: 'initial_call',
        timestamp: '2024-02-20T10:15:00Z',
        notes: 'Cold call - interested in services',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '5',
        fromStatus: 'initial_call',
        toStatus: 'offline_meeting',
        timestamp: '2024-02-25T16:20:00Z',
        notes: 'Meeting scheduled for next week',
        changedBy: 'Sarah Johnson'
      }
    ],
    notes: 'Small clinic focusing on preventive care. Looking for routine testing packages.',
    priority: 'medium'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    customerName: 'AIIMS New Delhi',
    companyName: 'All India Institute of Medical Sciences',
    contactPerson: 'Prof. Michael Chen',
    contactPosition: 'Research Director',
    email: 'michael.chen@aiims.edu',
    phone: '+91 11 2659 3333',
    address: 'Ansari Nagar, New Delhi, Delhi 110029',
    progressStatus: 'closed_won',
    salesEmployeeId: '550e8400-e29b-41d4-a716-446655440100',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-02-28T12:00:00Z',
    statusHistory: [
      {
        id: '6',
        fromStatus: null,
        toStatus: 'initial_call',
        timestamp: '2024-01-10T08:30:00Z',
        notes: 'Referral from existing client',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '7',
        fromStatus: 'initial_call',
        toStatus: 'offline_meeting',
        timestamp: '2024-01-15T13:45:00Z',
        notes: 'Technical requirements discussion',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '8',
        fromStatus: 'offline_meeting',
        toStatus: 'quotation_phase',
        timestamp: '2024-01-25T09:15:00Z',
        notes: 'Proposal submitted',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '9',
        fromStatus: 'quotation_phase',
        toStatus: 'negotiation',
        timestamp: '2024-02-10T15:30:00Z',
        notes: 'Price negotiation started',
        changedBy: 'Sarah Johnson'
      },
      {
        id: '10',
        fromStatus: 'negotiation',
        toStatus: 'closed_won',
        timestamp: '2024-02-28T12:00:00Z',
        notes: 'Contract signed - 2 year agreement',
        changedBy: 'Sarah Johnson'
      }
    ],
    notes: 'Academic research requiring specialized testing. Long-term partnership potential.',
    priority: 'high'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'Q-2024-001',
    customerContactId: '550e8400-e29b-41d4-a716-446655440001',
    customerName: 'Apollo Hospital Delhi',
    companyName: 'Apollo Hospitals Enterprise',
    customerAddress: 'Sarita Vihar, Mathura Road, New Delhi, Delhi 110076',
    kindAttention: 'Dr. Sarah Johnson',
    emailId: 'sarah.johnson@apollodelhi.com',
    phoneNumber: '+91 11 2692 5858',
    mobileNumber: '+91 98765 43210',
    title: 'Monthly Laboratory Services Package',
    status: 'pending',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
    expiresAt: '2024-03-31T23:59:59Z',
    tests: [
      {
        id: '1',
        testId: '1',
        productMaterial: 'Blood Sample',
        testName: 'Complete Blood Count (CBC)',
        testMethod: 'Flow Cytometry',
        category: 'Hematology',
        unitPrice: 3750.00,
        quantity: 100,
        totalPrice: 375000.00,
        turnaroundTime: 24
      },
      {
        id: '2',
        testId: '2',
        productMaterial: 'Serum Sample',
        testName: 'Lipid Profile',
        testMethod: 'Enzymatic Method',
        category: 'Clinical Chemistry',
        unitPrice: 2900.00,
        quantity: 80,
        totalPrice: 232000.00,
        turnaroundTime: 12
      }
    ],
    subtotal: 607000.00,
    additionalCharges: 0,
    totalAmount: 607500.00,
    taxType: 'CGST_SGST',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    cgstAmount: 54675.00,
    sgstAmount: 54675.00,
    igstAmount: 0,
    totalTaxAmount: 109350.00,
    roundOff: -25.00,
    amountInWords: 'Seven Lakh Sixteen Thousand Eight Hundred Twenty Five Rupees Only',
    finalAmount: 716825.00,
    notes: 'Volume discount applied for monthly contract',
    priority: 'high',
    salesEmployeeId: '550e8400-e29b-41d4-a716-446655440100',
    version: 2,
    versionHistory: [
      {
        id: '1',
        version: 1,
        createdAt: '2024-03-01T09:00:00Z',
        createdBy: 'Sarah Johnson',
        changes: 'Initial quote creation',
        tests: [],
        totalAmount: 7300.00,
        finalAmount: 7300.00
      }
    ],
    attachments: [
      {
        id: '1',
        filename: 'service_agreement_template.pdf',
        fileSize: 245760,
        fileType: 'application/pdf',
        uploadedAt: '2024-03-01T10:15:00Z',
        uploadedBy: 'Sarah Johnson',
        url: '/attachments/service_agreement_template.pdf'
      }
    ],
    lastAutoSave: '2024-03-01T14:28:00Z'
  },
  {
    id: 'Q-2024-002',
    customerContactId: '550e8400-e29b-41d4-a716-446655440002',
    customerName: 'Fortis Hospital Mumbai',
    companyName: 'Fortis Healthcare Limited',
    customerAddress: 'Mulund Goregaon Link Road, Mulund West, Mumbai, Maharashtra 400078',
    kindAttention: 'Maria Rodriguez',
    emailId: 'maria.rodriguez@fortismumbai.com',
    phoneNumber: '+91 22 6754 1000',
    mobileNumber: '+91 98765 43211',
    title: 'Routine Testing Package',
    status: 'draft',
    createdAt: '2024-02-28T11:20:00Z',
    updatedAt: '2024-02-28T16:45:00Z',
    expiresAt: '2024-03-30T23:59:59Z',
    tests: [
      {
        id: '3',
        testId: '3',
        productMaterial: 'Serum Sample',
        testName: 'Thyroid Function Panel',
        testMethod: 'Chemiluminescent Immunoassay',
        category: 'Endocrinology',
        unitPrice: 7100.00,
        quantity: 25,
        totalPrice: 177500.00,
        turnaroundTime: 24
      }
    ],
    subtotal: 177500.00,
    additionalCharges: 0,
    totalAmount: 177500.00,
    taxType: 'IGST',
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 31950.00,
    totalTaxAmount: 31950.00,
    roundOff: 0,
    amountInWords: 'Two Lakh Nine Thousand Four Hundred Fifty Rupees Only',
    finalAmount: 209450.00,
    notes: 'Draft quote for routine wellness testing',
    priority: 'medium',
    salesEmployeeId: '550e8400-e29b-41d4-a716-446655440100',
    version: 1,
    versionHistory: [],
    attachments: [],
    lastAutoSave: '2024-02-28T16:43:00Z'
  }
];

export const mockMetrics: SalesMetrics = {
  period: 'monthly',
  totalContacts: 156,
  totalQuotes: 42,
  convertedQuotes: 28,
  conversionRate: 66.7,
  totalRevenue: 20415000,
  averageQuoteValue: 486023,
  progressBreakdown: {
    initial_call: 45,
    offline_meeting: 38,
    quotation_phase: 32,
    negotiation: 15,
    closed_won: 28,
    closed_lost: 14
  },
  monthlyTrend: [
    { month: 'Jan', contacts: 125, quotes: 35, revenue: 16482000, conversionRate: 62.5 },
    { month: 'Feb', contacts: 142, quotes: 38, revenue: 18326000, conversionRate: 64.2 },
    { month: 'Mar', contacts: 156, quotes: 42, revenue: 20415000, conversionRate: 66.7 },
    { month: 'Apr', contacts: 168, quotes: 45, revenue: 22243000, conversionRate: 68.1 },
    { month: 'May', contacts: 175, quotes: 48, revenue: 23742000, conversionRate: 69.8 },
    { month: 'Jun', contacts: 182, quotes: 52, revenue: 25998000, conversionRate: 71.2 }
  ]
};

export const mockSalesData = {
  contacts: mockContacts,
  quotes: mockQuotes,
  metrics: mockMetrics
};