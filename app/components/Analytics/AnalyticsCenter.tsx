'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Shield,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsCenter() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState('claims');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalClaims: 1247,
      claimsGrowth: 12.5,
      totalPolicies: 23891,
      policyGrowth: 8.2,
      premiumVolume: 12400000,
      premiumGrowth: 9.8,
      fraudDetected: 23,
      fraudSavings: 145000
    },
    claimsAnalytics: [
      { period: 'Week 1', count: 45, value: 234000, approved: 38, denied: 7 },
      { period: 'Week 2', count: 52, value: 267000, approved: 44, denied: 8 },
      { period: 'Week 3', count: 38, value: 198000, approved: 32, denied: 6 },
      { period: 'Week 4', count: 61, value: 312000, approved: 53, denied: 8 }
    ],
    policyDistribution: [
      { type: 'Auto', count: 8500, premium: 4200000, growth: 5.2 },
      { type: 'Home', count: 6200, premium: 3800000, growth: 12.1 },
      { type: 'Commercial', count: 1800, premium: 2900000, growth: 18.5 },
      { type: 'Life', count: 4200, premium: 1200000, growth: -2.3 },
      { type: 'Health', count: 3191, premium: 300000, growth: 8.7 }
    ],
    riskMetrics: [
      { category: 'Auto', lowRisk: 65, mediumRisk: 25, highRisk: 10 },
      { category: 'Home', lowRisk: 78, mediumRisk: 18, highRisk: 4 },
      { category: 'Commercial', lowRisk: 45, mediumRisk: 35, highRisk: 20 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const getTrendColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Center</h1>
          <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            {getTrendIcon(analyticsData.overview.claimsGrowth)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analyticsData.overview.totalClaims.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-1">Total Claims</p>
            <p className={`text-sm font-medium ${getTrendColor(analyticsData.overview.claimsGrowth)}`}>
              +{analyticsData.overview.claimsGrowth}% from last period
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            {getTrendIcon(analyticsData.overview.policyGrowth)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analyticsData.overview.totalPolicies.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-1">Active Policies</p>
            <p className={`text-sm font-medium ${getTrendColor(analyticsData.overview.policyGrowth)}`}>
              +{analyticsData.overview.policyGrowth}% from last period
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            {getTrendIcon(analyticsData.overview.premiumGrowth)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(analyticsData.overview.premiumVolume)}
            </p>
            <p className="text-sm text-gray-600 mb-1">Premium Volume</p>
            <p className={`text-sm font-medium ${getTrendColor(analyticsData.overview.premiumGrowth)}`}>
              +{analyticsData.overview.premiumGrowth}% from last period
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(analyticsData.overview.fraudSavings)}
            </p>
            <p className="text-sm text-gray-600 mb-1">Fraud Savings</p>
            <p className="text-sm text-gray-600">
              {analyticsData.overview.fraudDetected} cases detected
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Claims Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('claims')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'claims' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Count
              </button>
              <button
                onClick={() => setSelectedMetric('value')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'value' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Value
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.claimsAnalytics.map((period, index) => {
              const maxValue = selectedMetric === 'claims' 
                ? Math.max(...analyticsData.claimsAnalytics.map(p => p.count))
                : Math.max(...analyticsData.claimsAnalytics.map(p => p.value));
              const currentValue = selectedMetric === 'claims' ? period.count : period.value;
              const percentage = (currentValue / maxValue) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{period.period}</span>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Approved: {period.approved}</span>
                      <span>Denied: {period.denied}</span>
                      <span className="font-medium">
                        {selectedMetric === 'claims' 
                          ? period.count 
                          : formatCurrency(period.value)
                        }
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Policy Distribution</h3>
          <div className="space-y-4">
            {analyticsData.policyDistribution.map((policy, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{policy.type}</p>
                      <p className="text-sm text-gray-600">{policy.count.toLocaleString()} policies</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(policy.premium)}</p>
                    <p className={`text-sm ${getTrendColor(policy.growth)}`}>
                      {policy.growth >= 0 ? '+' : ''}{policy.growth}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Analysis by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.riskMetrics.map((category, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-gray-900">{category.category}</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">Low Risk</span>
                  <span className="text-sm font-medium">{category.lowRisk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${category.lowRisk}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-600">Medium Risk</span>
                  <span className="text-sm font-medium">{category.mediumRisk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${category.mediumRisk}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">High Risk</span>
                  <span className="text-sm font-medium">{category.highRisk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${category.highRisk}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}