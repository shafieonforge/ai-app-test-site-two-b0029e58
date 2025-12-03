'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Car,
  Home,
  Building
} from 'lucide-react';
import NewPolicyForm from './NewPolicyForm';

export interface Policy {
  id: string;
  policyNumber: string;
  productType: 'PERSONAL_AUTO' | 'HOMEOWNERS' | 'COMMERCIAL_AUTO' | 'RENTERS' | 'UMBRELLA' | 'COMMERCIAL_PROPERTY';
  customer: {
    id: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    email: string;
    customerType: 'INDIVIDUAL' | 'BUSINESS';
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  effectiveDate: string;
  expirationDate: string;
  status: 'QUOTE' | 'BOUND' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED' | 'NON_RENEWED';
  totalPremium: number;
  paymentPlan: string;
  riskScore?: number;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  coverages: Array<{
    id: string;
    code: string;
    name: string;
    limit?: number;
    deductible?: number;
    premium: number;
  }>;
  insuredItems: Array<{
    id: string;
    type: string;
    description: string;
  }>;
  _count: {
    claims: number;
    endorsements: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPolicies();
    fetchCustomers();
  }, [currentPage, filterStatus, filterType, searchTerm]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterType !== 'all' && { productType: filterType }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/policies?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch policies');
        // Use mock data as fallback
        setPolicies(getMockPolicies());
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies(getMockPolicies());
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      } else {
        // Use mock customers as fallback
        setCustomers(getMockCustomers());
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers(getMockCustomers());
    }
  };

  const getMockPolicies = (): Policy[] => [
    {
      id: '1',
      policyNumber: 'POL-2024-000001',
      productType: 'PERSONAL_AUTO',
      customer: {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        customerType: 'INDIVIDUAL'
      },
      agent: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acmeinsurance.com'
      },
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      status: 'ACTIVE',
      totalPremium: 1200,
      paymentPlan: 'MONTHLY',
      riskScore: 45,
      complianceStatus: 'COMPLIANT',
      coverages: [
        { id: '1', code: 'BI', name: 'Bodily Injury Liability', limit: 250000, premium: 400 },
        { id: '2', code: 'PD', name: 'Property Damage Liability', limit: 100000, premium: 200 },
        { id: '3', code: 'COMP', name: 'Comprehensive', deductible: 500, premium: 300 },
        { id: '4', code: 'COLL', name: 'Collision', deductible: 500, premium: 300 }
      ],
      insuredItems: [
        { id: '1', type: 'VEHICLE', description: '2022 Honda Accord' }
      ],
      _count: { claims: 0, endorsements: 0 },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      policyNumber: 'POL-2024-000002',
      productType: 'HOMEOWNERS',
      customer: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@email.com',
        customerType: 'INDIVIDUAL'
      },
      effectiveDate: '2024-02-01',
      expirationDate: '2025-01-31',
      status: 'ACTIVE',
      totalPremium: 800,
      paymentPlan: 'ANNUAL',
      riskScore: 25,
      complianceStatus: 'COMPLIANT',
      coverages: [
        { id: '5', code: 'DWELLING', name: 'Dwelling', limit: 300000, premium: 500 },
        { id: '6', code: 'LIABILITY', name: 'Personal Liability', limit: 300000, premium: 150 },
        { id: '7', code: 'PERSONAL_PROPERTY', name: 'Personal Property', limit: 150000, premium: 150 }
      ],
      insuredItems: [
        { id: '2', type: 'BUILDING', description: '123 Main St, Anytown, ST 12345' }
      ],
      _count: { claims: 1, endorsements: 0 },
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      policyNumber: 'POL-2024-000003',
      productType: 'COMMERCIAL_AUTO',
      customer: {
        id: '3',
        businessName: 'Acme Delivery Corp',
        email: 'info@acmedelivery.com',
        customerType: 'BUSINESS'
      },
      effectiveDate: '2024-03-01',
      expirationDate: '2025-02-28',
      status: 'QUOTE',
      totalPremium: 2500,
      paymentPlan: 'QUARTERLY',
      riskScore: 60,
      complianceStatus: 'PENDING_REVIEW',
      coverages: [
        { id: '8', code: 'BI', name: 'Bodily Injury Liability', limit: 1000000, premium: 1200 },
        { id: '9', code: 'PD', name: 'Property Damage Liability', limit: 500000, premium: 600 },
        { id: '10', code: 'CARGO', name: 'Cargo Coverage', limit: 100000, premium: 700 }
      ],
      insuredItems: [
        { id: '3', type: 'VEHICLE', description: '2023 Ford Transit Van' },
        { id: '4', type: 'VEHICLE', description: '2023 Chevrolet Express' }
      ],
      _count: { claims: 0, endorsements: 1 },
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    }
  ];

  const getMockCustomers = () => [
    { 
      id: '1', 
      firstName: 'John', 
      lastName: 'Smith', 
      email: 'john.smith@email.com',
      customerType: 'INDIVIDUAL'
    },
    { 
      id: '2', 
      firstName: 'Jane', 
      lastName: 'Doe', 
      email: 'jane.doe@email.com',
      customerType: 'INDIVIDUAL'
    },
    { 
      id: '3', 
      businessName: 'Acme Delivery Corp', 
      email: 'info@acmedelivery.com',
      customerType: 'BUSINESS'
    },
    { 
      id: '4', 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      email: 'bob.johnson@email.com',
      customerType: 'INDIVIDUAL'
    }
  ];

  const handleCreatePolicy = async (policyData: any) => {
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });

      if (response.ok) {
        const result = await response.json();
        setShowNewForm(false);
        fetchPolicies(); // Refresh the list
        alert(`Policy ${result.policy?.policyNumber || 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create policy'}`);
      }
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'QUOTE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BOUND':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
      case 'NON_RENEWED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'PERSONAL_AUTO':
      case 'COMMERCIAL_AUTO':
        return Car;
      case 'HOMEOWNERS':
      case 'RENTERS':
        return Home;
      case 'COMMERCIAL_PROPERTY':
        return Building;
      case 'UMBRELLA':
        return Shield;
      default:
        return FileText;
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const customerName = policy.customer.businessName || 
                        `${policy.customer.firstName || ''} ${policy.customer.lastName || ''}`.trim();
    
    const matchesSearch = !searchTerm || 
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;
    const matchesType = filterType === 'all' || policy.productType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'ACTIVE').length,
    quotes: policies.filter(p => p.status === 'QUOTE').length,
    premium: policies.reduce((sum, p) => sum + p.totalPremium, 0)
  };

  if (showNewForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <NewPolicyForm
          onSubmit={handleCreatePolicy}
          onCancel={() => setShowNewForm(false)}
          customers={customers}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600">Manage insurance policies and track compliance</p>
        </div>
        <button 
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Policy
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Policies</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Quotes</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.quotes}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Premium Volume</p>
              <p className="text-2xl font-bold text-purple-900">
                ${(stats.premium / 1000).toFixed(0)}k
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies by number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="QUOTE">Quote</option>
            <option value="BOUND">Bound</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="PERSONAL_AUTO">Personal Auto</option>
            <option value="HOMEOWNERS">Homeowners</option>
            <option value="COMMERCIAL_AUTO">Commercial Auto</option>
            <option value="RENTERS">Renters</option>
            <option value="UMBRELLA">Umbrella</option>
            <option value="COMMERCIAL_PROPERTY">Commercial Property</option>
          </select>
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
                  Insured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                      <span className="ml-2 text-gray-600">Loading policies...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                    <p className="text-gray-600 mb-4">
                      {policies.length === 0 
                        ? 'Get started by creating your first policy.'
                        : 'No policies match your current filters.'
                      }
                    </p>
                    {policies.length === 0 && (
                      <button 
                        onClick={() => setShowNewForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Create First Policy
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => {
                  const ProductIcon = getProductIcon(policy.productType);
                  const customerName = policy.customer.businessName || 
                                     `${policy.customer.firstName || ''} ${policy.customer.lastName || ''}`.trim();
                  
                  return (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <ProductIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {policy.policyNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {policy.productType.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {policy.coverages.length} coverage{policy.coverages.length !== 1 ? 's' : ''}
                            {policy._count.claims > 0 && ` • ${policy._count.claims} claim${policy._count.claims !== 1 ? 's' : ''}`}
                            {policy.agent && ` • ${policy.agent.name}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            ${policy.totalPremium.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {policy.paymentPlan.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {new Date(policy.effectiveDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            to {new Date(policy.expirationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(policy.status)}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getRiskColor(policy.riskScore)}`}>
                            {policy.riskScore || 'N/A'}
                          </span>
                          {policy.complianceStatus !== 'COMPLIANT' && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Edit Policy"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Cancel Policy"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}