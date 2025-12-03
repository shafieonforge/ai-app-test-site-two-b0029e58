'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Shield,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Edit,
  MoreVertical,
  Download,
  Clock
} from 'lucide-react';

interface Policy {
  id: string;
  policyNumber: string;
  policyType: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  premiumAmount: number;
  deductible: number;
  riskScore?: number;
  customer: {
    firstName?: string;
    lastName?: string;
    businessName?: string;
    email: string;
  };
  coverages: any[];
  _count: {
    claims: number;
    documents: number;
  };
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/policies?${params}`);
      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCustomerName = (customer: Policy['customer']) => {
    if (customer.businessName) return customer.businessName;
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600">Manage insurance policies and coverage details</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Policy
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Policies</p>
              <p className="text-2xl font-bold text-blue-900">
                {policies.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">
                {policies.filter(p => p.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Premium Volume</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(policies.reduce((sum, p) => sum + p.premiumAmount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Claims Filed</p>
              <p className="text-2xl font-bold text-red-900">
                {policies.reduce((sum, p) => sum + p._count.claims, 0)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="AUTO">Auto</option>
              <option value="HOME">Home</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="LIFE">Life</option>
              <option value="HEALTH">Health</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
                  Claims
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading policies...</span>
                    </div>
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No policies found
                  </td>
                </tr>
              ) : (
                policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {policy.policyNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(policy.effectiveDate).toLocaleDateString()} - 
                          {new Date(policy.expirationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(policy.customer)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {policy.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {policy.policyType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(policy.premiumAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getRiskScoreColor(policy.riskScore)}`}>
                        {policy.riskScore || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        {policy._count.claims}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Edit Policy"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="More Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Detail Modal */}
      {showDetailModal && selectedPolicy && (
        <PolicyDetailModal
          policy={selectedPolicy}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPolicy(null);
          }}
        />
      )}

      {/* Create Policy Modal */}
      {showCreateModal && (
        <CreatePolicyModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPolicies();
          }}
        />
      )}
    </div>
  );
}

function PolicyDetailModal({ policy, onClose }: { policy: Policy; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Policy Details - {policy.policyNumber}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
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
                  <span className="font-medium">{policy.policyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${policy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium:</span>
                  <span className="font-medium">${policy.premiumAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductible:</span>
                  <span className="font-medium">${policy.deductible.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Date:</span>
                  <span className="font-medium">{new Date(policy.effectiveDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiration Date:</span>
                  <span className="font-medium">{new Date(policy.expirationDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {policy.customer.businessName || 
                     `${policy.customer.firstName || ''} ${policy.customer.lastName || ''}`.trim()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{policy.customer.email}</span>
                </div>
              </div>
            </div>
          </div>

          {policy.coverages && policy.coverages.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Coverage Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Coverage Type</th>
                      <th className="px-4 py-2 text-left">Limit</th>
                      <th className="px-4 py-2 text-left">Deductible</th>
                      <th className="px-4 py-2 text-left">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {policy.coverages.map((coverage, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{coverage.type}</td>
                        <td className="px-4 py-2">${coverage.limit.toLocaleString()}</td>
                        <td className="px-4 py-2">${coverage.deductible.toLocaleString()}</td>
                        <td className="px-4 py-2">${coverage.premium.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Edit Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePolicyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [policyData, setPolicyData] = useState({
    policyType: 'AUTO',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    premiumAmount: '',
    deductible: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers?limit=100');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer,
          ...policyData,
          premiumAmount: parseFloat(policyData.premiumAmount),
          deductible: parseFloat(policyData.deductible)
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create New Policy</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.businessName || `${customer.firstName} ${customer.lastName}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
              <select
                value={policyData.policyType}
                onChange={(e) => setPolicyData({...policyData, policyType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="AUTO">Auto</option>
                <option value="HOME">Home</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LIFE">Life</option>
                <option value="HEALTH">Health</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
              <input
                type="number"
                step="0.01"
                value={policyData.premiumAmount}
                onChange={(e) => setPolicyData({...policyData, premiumAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={policyData.effectiveDate}
                onChange={(e) => setPolicyData({...policyData, effectiveDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input
                type="date"
                value={policyData.expirationDate}
                onChange={(e) => setPolicyData({...policyData, expirationDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deductible</label>
            <input
              type="number"
              step="0.01"
              value={policyData.deductible}
              onChange={(e) => setPolicyData({...policyData, deductible: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}