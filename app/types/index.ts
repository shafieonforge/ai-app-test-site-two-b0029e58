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

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}