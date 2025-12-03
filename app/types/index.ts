// Unified type definitions
export interface ProcessingFile {
  id: string;
  name: string;
  type: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress: number;
  insights?: string[];
  error?: string;
}

export interface Insight {
  id: string;
  fileName: string;
  type: 'summary' | 'metric' | 'trend' | 'anomaly' | 'recommendation';
  title: string;
  content: string;
  confidence: number;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'processed' | 'processing' | 'failed';
  insightCount: number;
  category?: string;
  tags?: string[];
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Insurance-specific types
export interface Policy {
  id: string;
  policyNumber: string;
  policyType: 'auto' | 'home' | 'commercial' | 'life' | 'health';
  insuredName: string;
  premiumAmount: number;
  deductible: number;
  effectiveDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  riskScore: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
  lastReview: Date;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  incidentDate: Date;
  reportedDate: Date;
  status: 'open' | 'investigating' | 'processing' | 'closed' | 'denied';
  lossAmount: number;
  reserveAmount: number;
  description: string;
  adjusterName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'underwriter' | 'adjuster' | 'executive' | 'auditor';
  department: string;
  permissions: string[];
  organization: string;
  lastLogin?: Date;
}