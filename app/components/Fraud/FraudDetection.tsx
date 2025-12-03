'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Search,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  User,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  Brain
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'duplicate_claim' | 'suspicious_pattern' | 'excessive_claims' | 'staged_accident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  claimNumber: string;
  policyNumber: string;
  insuredName: string;
  riskScore: number;
  investigationRequired: boolean;
  status: 'pending' | 'investigating' | 'confirmed' | 'dismissed';
  createdDate: Date;
  assignedTo?: string;
  estimatedSavings: number;
}

export default function FraudDetection() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    {
      id: '1',
      type: 'excessive_claims',
      severity: 'high',
      title: 'Multiple High-Value Claims',
      description: 'Policyholder has filed 3 claims totaling $125,000 in the past 6 months',
      claimNumber: 'CLM-789123',
      policyNumber: 'AUTO-2024-001',
      insuredName: 'John Smith',
      riskScore: 85,
      investigationRequired: true,
      status: 'pending',
      createdDate: new Date('2024-01-15'),
      estimatedSavings: 75000
    },
    {
      id: '2',
      type: 'suspicious_pattern',
      severity: 'medium',
      title: 'Unusual Claim Pattern',
      description: 'Claim timing and location patterns suggest potential coordination',
      claimNumber: 'CLM-456789',
      policyNumber: 'HOME-2024-002',
      insuredName: 'Jane Doe',
      riskScore: 68,
      investigationRequired: true,
      status: 'investigating',
      createdDate: new Date('2024-01-20'),
      assignedTo: 'Mike Johnson',
      estimatedSavings: 25000
    },
    {
      id: '3',
      type: 'duplicate_claim',
      severity: 'critical',
      title: 'Potential Duplicate Submission',
      description: 'Similar claim details found across multiple policies',
      claimNumber: 'CLM-234567',
      policyNumber: 'COMM-2024-003',
      insuredName: 'ABC Corp',
      riskScore: 92,
      investigationRequired: true,
      status: 'confirmed',
      createdDate: new Date('2024-01-10'),
      assignedTo: 'Sarah Wilson',
      estimatedSavings: 150000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-red-600';
      case 'investigating': return 'text-yellow-600';
      case 'dismissed': return 'text-gray-600';
      case 'pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'duplicate_claim': return <Flag className="h-5 w-5 text-red-500" />;
      case 'suspicious_pattern': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'excessive_claims': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'staged_accident': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.insuredName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const fraudStats = {
    totalAlerts: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
    confirmed: alerts.filter(a => a.status === 'confirmed').length,
    estimatedSavings: alerts.reduce((sum, a) => sum + a.estimatedSavings, 0)
  };

  const updateAlertStatus = (alertId: string, newStatus: FraudAlert['status']) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Detection</h1>
          <p className="text-gray-600">AI-powered fraud detection and investigation management</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <AlertTriangle className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{fraudStats.totalAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-blue-900">{fraudStats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-2xl font-bold text-yellow-900">{fraudStats.investigating}</p>
            </div>
            <Search className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Fraud</p>
              <p className="text-2xl font-bold text-red-900">{fraudStats.confirmed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Est. Savings</p>
              <p className="text-2xl font-bold text-green-900">${(fraudStats.estimatedSavings / 1000).toFixed(0)}k</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by claim, policy, or insured name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="confirmed">Confirmed</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Fraud Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fraud Alerts ({filteredAlerts.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Claim: {alert.claimNumber}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Policy: {alert.policyNumber}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {alert.insuredName}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">
                          Risk Score: {alert.riskScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          Est. Savings: ${alert.estimatedSavings.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {alert.createdDate.toLocaleDateString()}
                        </span>
                      </div>
                      {alert.assignedTo && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-600">
                            Assigned to: {alert.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </button>
                  
                  {alert.status === 'pending' && (
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'investigating')}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
                    >
                      <Search className="h-4 w-4" />
                      Investigate
                    </button>
                  )}
                  
                  {alert.status === 'investigating' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'confirmed')}
                        className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'dismissed')}
                        className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedAlert.type)}
                <h3 className="text-lg font-semibold text-gray-900">
                  Fraud Alert Details
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Alert Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium capitalize">{selectedAlert.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Severity:</span>
                      <p className={`font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Score:</span>
                      <p className="font-medium text-red-600">{selectedAlert.riskScore}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className={`font-medium ${getStatusColor(selectedAlert.status)}`}>
                        {selectedAlert.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created Date:</span>
                      <p className="font-medium">{selectedAlert.createdDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Savings:</span>
                      <p className="font-medium text-green-600">
                        ${selectedAlert.estimatedSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedAlert.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Related Claims & Policies</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">Claim {selectedAlert.claimNumber}</p>
                          <p className="text-sm text-gray-600">Policy: {selectedAlert.policyNumber}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Insured: {selectedAlert.insuredName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}