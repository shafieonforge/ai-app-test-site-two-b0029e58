// Enterprise Insurance Types
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

export interface Organization {
  id: string;
  name: string;
  type: 'carrier' | 'agency' | 'mga' | 'reinsurer';
  licenseNumber: string;
  states: string[];
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  autoProcessing: boolean;
  retentionPeriod: number; // days
  complianceLevel: 'basic' | 'enhanced' | 'strict';
  integrations: string[];
}

export interface ClaimDocument {
  id: string;
  claimNumber: string;
  policyNumber: string;
  documentType: 'incident_report' | 'estimate' | 'photos' | 'police_report' | 'medical_records';
  extractedData: {
    incidentDate?: Date;
    lossAmount?: number;
    damageDescription?: string;
    parties?: Party[];
    location?: Location;
  };
  confidence: number;
  flags: string[];
  processingStatus: 'pending' | 'processed' | 'review_required' | 'approved';
}

export interface PolicyDocument {
  id: string;
  policyNumber: string;
  policyType: 'auto' | 'home' | 'commercial' | 'life' | 'health';
  extractedData: {
    coverageDetails?: Coverage[];
    premiumAmount?: number;
    deductible?: number;
    effectiveDate?: Date;
    expirationDate?: Date;
    insuredParty?: Party;
  };
  riskScore?: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface Coverage {
  type: string;
  limit: number;
  deductible: number;
  premium: number;
}

export interface Party {
  name: string;
  address?: Location;
  phone?: string;
  email?: string;
  relationship: 'insured' | 'claimant' | 'witness' | 'other_party';
}

export interface Location {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface FraudAlert {
  id: string;
  type: 'duplicate_claim' | 'suspicious_pattern' | 'excessive_claims' | 'staged_accident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  documentIds: string[];
  riskScore: number;
  investigationRequired: boolean;
}

export interface ComplianceIssue {
  id: string;
  type: 'missing_disclosure' | 'invalid_signature' | 'expired_license' | 'regulatory_violation';
  regulation: string;
  severity: 'warning' | 'violation' | 'critical';
  description: string;
  remediation: string;
  dueDate: Date;
}

export interface AnalyticsData {
  claimVolume: {
    period: string;
    count: number;
    totalValue: number;
    averageValue: number;
  }[];
  policyMetrics: {
    newPolicies: number;
    renewals: number;
    cancellations: number;
    premiumGrowth: number;
  };
  riskTrends: {
    category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    riskScore: number;
  }[];
  fraudStats: {
    alertsGenerated: number;
    investigationsOpened: number;
    fraudConfirmed: number;
    savingsEstimated: number;
  };
}