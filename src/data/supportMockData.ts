import { SampleHistory, SampleRecord, Complaint } from '../types';

export const mockSampleHistory: SampleHistory[] = [
  {
    id: 'SH-001',
    quoteId: 'Q-2024-001',
    sampleRecords: [
      {
        id: 'SR-001',
        quoteId: 'Q-2024-001',
        sampleType: 'Blood',
        originalQuantity: 100,
        actualSampleValue: 375000,
        samplesReceived: 95,
        dateReceived: '2024-03-15T10:30:00Z',
        receivedBy: 'Emma Wilson',
        notes: 'Slight shortage in samples received, adjusted pricing accordingly',
        createdAt: '2024-03-15T10:35:00Z',
        updatedAt: '2024-03-15T10:35:00Z'
      },
      {
        id: 'SR-002',
        quoteId: 'Q-2024-001',
        sampleType: 'Serum',
        originalQuantity: 80,
        actualSampleValue: 232000,
        samplesReceived: 80,
        dateReceived: '2024-03-16T09:15:00Z',
        receivedBy: 'Emma Wilson',
        notes: 'All samples received as expected',
        createdAt: '2024-03-16T09:20:00Z',
        updatedAt: '2024-03-16T09:20:00Z'
      }
    ],
    totalSamplesReceived: 175,
    lastUpdated: '2024-03-16T09:20:00Z'
  },
  {
    id: 'SH-002',
    quoteId: 'Q-2024-002',
    sampleRecords: [
      {
        id: 'SR-003',
        quoteId: 'Q-2024-002',
        sampleType: 'Serum',
        originalQuantity: 25,
        actualSampleValue: 177500,
        samplesReceived: 25,
        dateReceived: '2024-03-14T14:20:00Z',
        receivedBy: 'Emma Wilson',
        notes: 'Complete sample set received for thyroid function tests',
        createdAt: '2024-03-14T14:25:00Z',
        updatedAt: '2024-03-14T14:25:00Z'
      }
    ],
    totalSamplesReceived: 25,
    lastUpdated: '2024-03-14T14:25:00Z'
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: 'C-001',
    ticketNumber: 'TKT-2024-001',
    customerName: 'Dr. Rajesh Kumar',
    customerEmail: 'rajesh.kumar@apollodelhi.com',
    customerPhone: '+91 98765 43210',
    complaintDescription: 'Received incorrect test results for blood chemistry panel. The values seem inconsistent with patient history and clinical presentation. Requesting immediate review and retesting.',
    priority: 'high',
    status: 'in_progress',
    relatedQuoteId: 'Q-2024-001',
    assignedTo: 'Sarah Johnson',
    assignedBy: 'Emma Wilson',
    createdAt: '2024-03-15T11:30:00Z',
    updatedAt: '2024-03-15T14:45:00Z',
    attachments: [
      {
        id: 'ATT-001',
        filename: 'original_test_results.pdf',
        fileSize: 245760,
        fileType: 'application/pdf',
        uploadedAt: '2024-03-15T11:35:00Z',
        uploadedBy: 'Dr. Rajesh Kumar',
        url: '/attachments/original_test_results.pdf'
      },
      {
        id: 'ATT-002',
        filename: 'patient_history.jpg',
        fileSize: 1024000,
        fileType: 'image/jpeg',
        uploadedAt: '2024-03-15T11:36:00Z',
        uploadedBy: 'Dr. Rajesh Kumar',
        url: '/attachments/patient_history.jpg'
      }
    ],
    statusHistory: [
      {
        id: 'SH-001',
        fromStatus: '',
        toStatus: 'open',
        timestamp: '2024-03-15T11:30:00Z',
        changedBy: 'Emma Wilson',
        notes: 'Complaint received and logged'
      },
      {
        id: 'SH-002',
        fromStatus: 'open',
        toStatus: 'in_progress',
        timestamp: '2024-03-15T14:45:00Z',
        changedBy: 'Sarah Johnson',
        notes: 'Assigned to laboratory team for review'
      }
    ]
  },
  {
    id: 'C-002',
    ticketNumber: 'TKT-2024-002',
    customerName: 'Dr. Priya Sharma',
    customerEmail: 'priya.sharma@fortismumbai.com',
    customerPhone: '+91 87654 32109',
    complaintDescription: 'Delayed delivery of test results. The samples were submitted on time but results are 2 days overdue. This is affecting patient care and treatment decisions.',
    priority: 'medium',
    status: 'resolved',
    relatedQuoteId: 'Q-2024-002',
    assignedTo: 'Michael Chen',
    assignedBy: 'Emma Wilson',
    createdAt: '2024-03-12T09:15:00Z',
    updatedAt: '2024-03-14T16:30:00Z',
    attachments: [],
    statusHistory: [
      {
        id: 'SH-003',
        fromStatus: '',
        toStatus: 'open',
        timestamp: '2024-03-12T09:15:00Z',
        changedBy: 'Emma Wilson',
        notes: 'Complaint received regarding delayed results'
      },
      {
        id: 'SH-004',
        fromStatus: 'open',
        toStatus: 'in_progress',
        timestamp: '2024-03-12T10:00:00Z',
        changedBy: 'Michael Chen',
        notes: 'Investigating cause of delay'
      },
      {
        id: 'SH-005',
        fromStatus: 'in_progress',
        toStatus: 'resolved',
        timestamp: '2024-03-14T16:30:00Z',
        changedBy: 'Michael Chen',
        notes: 'Results delivered and process improved to prevent future delays'
      }
    ],
    resolutionNotes: 'Issue was due to equipment calibration delay. Results have been delivered and additional quality checks implemented.',
    resolvedAt: '2024-03-14T16:30:00Z'
  },
  {
    id: 'C-003',
    ticketNumber: 'TKT-2024-003',
    customerName: 'Dr. Amit Patel',
    customerEmail: 'amit.patel@citywellness.com',
    customerPhone: '+91 76543 21098',
    complaintDescription: 'Sample containers were damaged during transportation. Several vials were cracked and samples were contaminated. Need replacement testing at no additional cost.',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'David Rodriguez',
    assignedBy: 'Emma Wilson',
    createdAt: '2024-03-16T08:45:00Z',
    updatedAt: '2024-03-16T08:45:00Z',
    attachments: [
      {
        id: 'ATT-003',
        filename: 'damaged_containers.jpg',
        fileSize: 2048000,
        fileType: 'image/jpeg',
        uploadedAt: '2024-03-16T08:50:00Z',
        uploadedBy: 'Dr. Amit Patel',
        url: '/attachments/damaged_containers.jpg'
      }
    ],
    statusHistory: [
      {
        id: 'SH-006',
        fromStatus: '',
        toStatus: 'open',
        timestamp: '2024-03-16T08:45:00Z',
        changedBy: 'Emma Wilson',
        notes: 'Urgent complaint received regarding damaged samples during transport'
      }
    ]
  }
];

export const mockSupportData = {
  sampleHistory: mockSampleHistory,
  complaints: mockComplaints
};