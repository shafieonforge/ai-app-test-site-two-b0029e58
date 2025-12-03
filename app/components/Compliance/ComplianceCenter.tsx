'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  Search,
  Calendar,
  User,
  Building,
  Flag,
  Download,
  Eye,
  XCircle,
  CheckCircle
} from 'lucide-react';

interface ComplianceIssue {
  id: string;
  type: 'missing_disclosure' | 'invalid_signature' | 'expired_license' | 'regulatory_violation';
  regulation: string;
  severity: 'warning' | 'violation' | 'critical';
  title: string;
  description: string;
  policyNumber: string;
  insuredName: string;
  remediation: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'overdue';
  assignedTo?: string;
  createdDate: Date;
}

export default function ComplianceCenter() {
  const [issues, setIssues] = useState<ComplianceIssue[]>([
    {
      id: '1',
      type: 'missing_disclosure',
      regulation: 'State Insurance Regulation 12.3',
      severity: 'violation',
      title: 'Missing Required Disclosure',
      description: 'Policy lacks required flood insurance disclosure statement',
      policyNumber: 'HOME-2024-002',
      insuredName: 'Jane Doe',
      remediation: 'Obtain signed disclosure form within 30 days',
      dueDate: new Date('2024-02-15'),
      status: 'open',
      createdDate: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'expired_license',
      regulation: 'DOI License Requirement',
      severity: 'critical',
      title: 'Expired Agent License',
      description: 'Agent license expired before policy issuance',
      policyNumber: 'AUTO-2024-001',
      insuredName: 'John Smith',
      remediation: 'Void policy or transfer to licensed agent',
      dueDate: new Date('2024-01-30'),
      status: 'overdue',
      assignedTo: 'Mike Johnson',
      createdDate: new Date('2024-01-10')
    },
    {
      id: '3',
      type: 'regulatory_violation',
      regulation: 'GDPR Article 13',
      severity: 'warning',
      title: 'Data Processing Notice',
      description: 'Privacy notice does not meet GDPR transparency requirements',
      policyNumber: 'COMM-2024-003',
      insuredName: 'ABC Corp',
      remediation: 'Update privacy notice and obtain new consent',
      dueDate: new Date('2024-02-20'),
      status: 'in_progress',
      assignedTo: 'Sarah Wilson',
      createdDate: new Date('2024-01-20')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'violation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'overdue': return 'text-red-600';
      case 'open': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'missing_disclosure': return <FileText className="h-5 w-5 text-orange-500" />;
      case 'invalid_signature': return <User className="h-5 w-5 text-red-500" />;
      case 'expired_license': return <Calendar className="h-5 w-5 text-red-500" />;
      case 'regulatory_violation': return <Flag className="h-5 w-5 text-purple-500" />;
      default: return <CheckSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.insuredName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const complianceStats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    overdue: issues.filter(i => i.status === 'overdue').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    complianceRate: Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100)
  };

  const updateIssueStatus = (issueId: string, newStatus: ComplianceIssue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
          <p className="text-gray-600">Monitor regulatory compliance and manage violations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Compliance Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{complianceStats.total}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-yellow-900">{complianceStats.open}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{complianceStats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-900">{complianceStats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-blue-900">{complianceStats.complianceRate}%</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
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
              placeholder="Search by title, policy, or insured name..."
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
            <option value="violation">Violation</option>
            <option value="warning">Warning</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Compliance Issues List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Compliance Issues ({filteredIssues.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredIssues.map((issue) => {
            const daysUntilDue = getDaysUntilDue(issue.dueDate);
            
            return (
              <div key={issue.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getTypeIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{issue.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Policy: {issue.policyNumber}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {issue.insuredName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          {issue.regulation}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Due: {issue.dueDate.toLocaleDateString()}
                          {daysUntilDue < 0 && (
                            <span className="text-red-600 font-medium">
                              ({Math.abs(daysUntilDue)} days overdue)
                            </span>
                          )}
                          {daysUntilDue >= 0 && daysUntilDue <= 7 && (
                            <span className="text-orange-600 font-medium">
                              ({daysUntilDue} days left)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {issue.assignedTo && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <User className="h-4 w-4" />
                          Assigned to: {issue.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </button>
                    
                    {issue.status === 'open' && (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
                      >
                        <Clock className="h-4 w-4" />
                        Start Work
                      </button>
                    )}
                    
                    {issue.status === 'in_progress' && (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedIssue.type)}
                <h3 className="text-lg font-semibold text-gray-900">
                  Compliance Issue Details
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Issue Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium capitalize">{selectedIssue.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Severity:</span>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(selectedIssue.severity)}`}>
                        {selectedIssue.severity.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className={`font-medium ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <p className="font-medium">{selectedIssue.dueDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Policy:</span>
                      <p className="font-medium">{selectedIssue.policyNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Insured:</span>
                      <p className="font-medium">{selectedIssue.insuredName}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Regulation</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded">
                    {selectedIssue.regulation}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedIssue.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Remediation Steps</h4>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded">
                    {selectedIssue.remediation}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setSelectedIssue(null)}
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