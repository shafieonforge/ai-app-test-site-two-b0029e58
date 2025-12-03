'use client';

import React, { useState } from 'react';
import {
  Shield,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Home,
  Car,
  Building,
  Heart,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Policy {
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

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      policyNumber: 'AUTO-2024-001',
      policyType: 'auto',
      insuredName: 'John Smith',
      premiumAmount: 1200,
      deductible: 500,
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2024-12-31'),
      status: 'active',
      riskScore: 45,
      complianceStatus: 'compliant',
      lastReview: new Date('2024-01-15')
    },
    {
      id: '2',
      policyNumber: 'HOME-2024-002',
      policyType: 'home',
      insuredName: 'Jane Doe',
      premiumAmount: 800,
      deductible: 1000,
      effectiveDate: new Date('2024-02-01'),
      expirationDate: new Date('2025-01-31'),
      status: 'active',
      riskScore: 25,
      complianceStatus: 'compliant',
      lastReview: new Date('2024-02-10')
    },
    {
      id: '3',
      policyNumber: 'COMM-2024-003',
      policyType: 'commercial',
      insuredName: 'ABC Corp',
      premiumAmount: 5000,
      deductible: 2500,
      effectiveDate: new Date('2024-01-15'),
      expirationDate: new Date('2024-12-31'),
      status: 'active',
      riskScore: 65,
      complianceStatus: 'pending_review',
      lastReview: new Date('2024-01-20')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'auto': return <Car className="h-5 w-5 text-blue-500" />;
      case 'home': return <Home className="h-5 w-5 text-green-500" />;
      case 'commercial': return <Building className="h-5 w-5 text-purple-500" />;
      case 'life': return <Heart className="h-5 w-5 text-red-500" />;
      case 'health': return <Heart className="h-5 w-5 text-pink-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'non_compliant': return 'text-red-600';
      case 'pending_review': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.insuredName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || policy.policyType === filterType;
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const policyStats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    expiringSoon: policies.filter(p => {
      const daysToExpiry = Math.ceil((p.expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length,
    highRisk: policies.filter(p => p.riskScore >= 60).length
  };

  const totalPremiumValue = policies
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + p.premiumAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600">Manage policies, assess risk, and ensure compliance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload Policies
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4" />
            New Policy
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{policyStats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-green-900">{policyStats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-900">{policyStats.expiringSoon}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium Value</p>
              <p className="text-2xl font-bold text-purple-900">${(totalPremiumValue / 1000).toFixed(0)}k</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
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
              placeholder="Search by policy number or insured name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="auto">Auto</option>
            <option value="home">Home</option>
            <option value="commercial">Commercial</option>
            <option value="life">Life</option>
            <option value="health">Health</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Policies ({filteredPolicies.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getPolicyIcon(policy.policyType)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {policy.policyNumber}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {policy.policyType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {policy.insuredName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires: {policy.expirationDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${policy.premiumAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Deductible: ${policy.deductible}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(policy.riskScore)}`}>
                      {policy.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getComplianceColor(policy.complianceStatus)}`}>
                      {policy.complianceStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPolicy(policy)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Policy Details - {selectedPolicy.policyNumber}
              </h3>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Policy Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Type:</span>
                      <span className="font-medium capitalize">{selectedPolicy.policyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Amount:</span>
                      <span className="font-medium">${selectedPolicy.premiumAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductible:</span>
                      <span className="font-medium">${selectedPolicy.deductible.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <span className="font-medium">{selectedPolicy.effectiveDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiration Date:</span>
                      <span className="font-medium">{selectedPolicy.expirationDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Risk Score</span>
                        <span className={`text-sm font-medium ${getRiskColor(selectedPolicy.riskScore)}`}>
                          {selectedPolicy.riskScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            selectedPolicy.riskScore < 30 ? 'bg-green-500' :
                            selectedPolicy.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedPolicy.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900 mb-1">Compliance Status</p>
                      <p className={`text-sm ${getComplianceColor(selectedPolicy.complianceStatus)}`}>
                        {selectedPolicy.complianceStatus.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last reviewed: {selectedPolicy.lastReview.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Generate Report
                </button>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Edit Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}