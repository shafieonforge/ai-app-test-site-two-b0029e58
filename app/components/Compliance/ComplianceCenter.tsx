'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

interface ComplianceIssue {
  id: string;
  type: string;
  regulation: string;
  severity: 'warning' | 'violation' | 'critical';
  description: string;
  remediation: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved';
  entityType: 'policy' | 'claim' | 'customer';
  entityId: string;
}

export default function ComplianceCenter() {
  const [issues] = useState<ComplianceIssue[]>([
    {
      id: '1',
      type: 'Missing Documentation',
      regulation: 'State Insurance Code 123.45',
      severity: 'violation',
      description: 'Policy missing required disclosure documents',
      remediation: 'Obtain signed disclosure forms from policyholder',
      dueDate: new Date('2024-02-15'),
      status: 'open',
      entityType: 'policy',
      entityId: 'POL-2024-001'
    },
    {
      id: '2',
      type: 'Claim Processing Delay',
      regulation: 'Fair Claims Settlement Practices',
      severity: 'warning',
      description: 'Claim exceeds maximum processing time limit',
      remediation: 'Expedite claim processing or issue delay notification',
      dueDate: new Date('2024-01-30'),
      status: 'in_progress',
      entityType: 'claim',
      entityId: 'CLM-789123'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'violation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.regulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
          <p className="text-gray-600">Monitor regulatory compliance and manage issues</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical Issues</p>
              <p className="text-2xl font-bold text-red-900">
                {issues.filter(i => i.severity === 'critical').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Violations</p>
              <p className="text-2xl font-bold text-orange-900">
                {issues.filter(i => i.severity === 'violation').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-900">
                {issues.filter(i => i.severity === 'warning').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Resolved</p>
              <p className="text-2xl font-bold text-green-900">
                {issues.filter(i => i.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
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
              placeholder="Search compliance issues..."
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
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  {isOverdue(issue.dueDate) && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      Overdue
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {issue.type}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Regulation:</strong> {issue.regulation}
                </p>
                
                <p className="text-gray-700 mb-3">{issue.description}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Remediation Required:</strong> {issue.remediation}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {issue.dueDate.toLocaleDateString()}
                </div>
                <div>
                  Entity: {issue.entityType} ({issue.entityId})
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  View Details
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No compliance issues found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}