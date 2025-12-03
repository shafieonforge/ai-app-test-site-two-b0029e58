export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  customerId: string;
  type: 'auto' | 'home' | 'commercial' | 'life' | 'health' | 'umbrella';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  effectiveDate: Date;
  expirationDate: Date;
  premiumAmount: number;
  deductible: number;
  coverages: Coverage[];
  riskAssessment: RiskAssessment;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface Coverage {
  id: string;
  type: string;
  limit: number;
  deductible: number;
  premium: number;
}

export interface RiskAssessment {
  score: number;
  factors: RiskFactor[];
  lastUpdated: Date;
}

export interface RiskFactor {
  type: string;
  value: string | number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  type: 'collision' | 'comprehensive' | 'liability' | 'property' | 'medical';
  status: 'open' | 'investigating' | 'processing' | 'settled' | 'denied' | 'closed';
  lossDate: Date;
  reportedDate: Date;
  lossAmount: number;
  reserveAmount: number;
  paidAmount: number;
  description: string;
  location: string;
  adjusterAssigned?: string;
  fraudIndicators: FraudIndicator[];
}

export interface FraudIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  detectedAt: Date;
}

export interface Customer {
  id: string;
  type: 'individual' | 'business';
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  contactInfo: ContactInfo;
  riskProfile: RiskProfile;
  policies: InsurancePolicy[];
  claims: Claim[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  ssn: string;
  driversLicense?: string;
}

export interface BusinessInfo {
  businessName: string;
  ein: string;
  industry: string;
  yearsInBusiness: number;
}

export interface ContactInfo {
  primaryPhone: string;
  email: string;
  address: Address;
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface RiskProfile {
  score: number;
  category: 'low' | 'moderate' | 'high' | 'very_high';
  factors: RiskFactor[];
  lastAssessed: Date;
}