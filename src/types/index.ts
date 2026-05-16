// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  departmentId: string | null;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  permissions: Permission[];
  isFirstLogin?: boolean;
}

export type UserRole = 'sales' | 'admin' | 'support' | 'management';

export interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
  isFirstLogin: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  budget: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  department: string;
}

// Contact and Customer Types
export interface CustomerContact {
  id: string;
  customerName: string;
  companyName: string;
  contactPerson: string;
  contactPosition: string;
  email: string;
  phone: string;
  address: string;
  progressStatus: ProgressStatus;
  salesEmployeeId: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusChange[];
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

export type ProgressStatus = 'initial_call' | 'offline_meeting' | 'quotation_phase' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface StatusChange {
  id: string;
  fromStatus: ProgressStatus | null;
  toStatus: ProgressStatus;
  timestamp: string;
  notes?: string;
  changedBy: string;
}

// Enhanced Quote Types
export interface Quote {
  id: string;
  customerContactId: string;
  customerName: string;
  companyName: string;
  customerAddress: string;
  kindAttention: string;
  emailId: string;
  phoneNumber: string;
  mobileNumber: string;
  title: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  tests: QuoteTest[];
  totalAmount: number;
  additionalCharges: number;
  subtotal: number;
  taxType: 'CGST_SGST' | 'IGST';
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  roundOff: number;
  finalAmount: number;
  amountInWords: string;
  notes?: string;
  approver?: string;
  priority: 'low' | 'medium' | 'high';
  salesEmployeeId: string;
  version: number;
  versionHistory: QuoteVersion[];
  attachments: QuoteAttachment[];
  lastAutoSave: string;
  samples?: QuoteSample[];
}

export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'revised';

export interface QuoteVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
  tests: QuoteTest[];
  totalAmount: number;
  finalAmount: number;
}

export interface QuoteAttachment {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface QuoteSample {
  id: string;
  sampleType: string;
  quotedQuantity: number;
  actualQuantity?: number;
  unitPrice: number;
  totalPrice: number;
  adjustedPrice?: number;
  lastModified?: string;
  modifiedBy?: string;
  justification?: string;
}

export interface QuoteTest {
  id: string;
  testId: string;
  productMaterial: string;
  testName: string;
  testMethod: string;
  category: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  turnaroundTime: number;
}

// Laboratory Test Types
export interface LaboratoryTest {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  unitPrice: number;
  turnaroundTime: number;
  accreditation: string[];
  methodology: string;
  sampleRequirements: string;
  isActive: boolean;
  popularity: number;
  department: string;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  contactPerson: string;
  createdAt: string;
  totalQuotes: number;
  totalValue: number;
  status: 'active' | 'inactive';
  preferredTests: string[];
  salesEmployeeId: string;
}

// Analytics and Reporting Types
export interface SalesMetrics {
  period: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  totalContacts: number;
  totalQuotes: number;
  convertedQuotes: number;
  conversionRate: number;
  totalRevenue: number;
  averageQuoteValue: number;
  progressBreakdown: Record<ProgressStatus, number>;
  monthlyTrend: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  contacts: number;
  quotes: number;
  revenue: number;
  conversionRate: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  department: string;
  totalContacts: number;
  totalQuotes: number;
  conversionRate: number;
  revenue: number;
  averageQuoteValue: number;
  ranking: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DepartmentAnalytics {
  department: string;
  totalEmployees: number;
  totalQuotes: number;
  totalRevenue: number;
  averageConversionRate: number;
  topPerformers: EmployeePerformance[];
  monthlyPerformance: MonthlyData[];
}

// Sales Target Management Types
export interface SalesTarget {
  id: string;
  employeeId: string;
  employeeName: string;
  year: number;
  annualTarget: number;
  monthlyTargets: MonthlyTarget[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyTarget {
  month: number; // 1-12 for Jan-Dec
  targetAmount: number;
  adjustedAmount?: number;
  actualAmount: number;
  shortfall: number;
  personalTarget?: number;
  isAdjusted: boolean;
  achievementPercentage: number;
}

export interface TargetNotification {
  id: string;
  employeeId: string;
  employeeName: string;
  message: string;
  type: 'target_set' | 'target_adjusted' | 'target_achieved' | 'target_missed';
  isRead: boolean;
  createdAt: string;
  createdBy: string;
}

// Sales Target Management Types (Enhanced)
export interface SalesTargetWithDetails extends SalesTarget {
  employeeDetails?: {
    name: string;
    email: string;
    department: string;
  };
  progress?: {
    totalAchieved: number;
    achievementPercentage: number;
    remainingAmount: number;
    isOnTrack: boolean;
  };
}

// System Configuration Types
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isEditable: boolean;
  lastModified: string;
  modifiedBy: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalQuotes: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  activeClients: number;
  completionRate: number;
  averageQuoteValue: number;
  totalEmployees?: number;
  activeSessions?: number;
}

// Search and Filter Types
export interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: QuoteStatus[];
  priority?: ('low' | 'medium' | 'high')[];
  department?: string[];
  employee?: string[];
  customer?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Sample Analysis Types
export interface SampleRecord {
  id: string;
  quoteId: string;
  sampleType: string;
  originalQuantity: number;
  actualSampleValue?: number;
  samplesReceived?: number;
  dateReceived?: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleHistory {
  id: string;
  quoteId: string;
  sampleRecords: SampleRecord[];
  totalSamplesReceived: number;
  lastUpdated: string;
}

// Complaint Management Types
export interface Complaint {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  complaintDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  relatedQuoteId?: string;
  assignedTo?: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  attachments: ComplaintAttachment[];
  statusHistory: ComplaintStatusChange[];
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface ComplaintAttachment {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface ComplaintStatusChange {
  id: string;
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  changedBy: string;
  notes?: string;
}