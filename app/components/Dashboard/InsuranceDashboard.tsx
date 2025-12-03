'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  AlertTriangle,
  Shield,
  BarChart3,
  CheckCircle,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';

export default function InsuranceDashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('claims');

  const quickStats = [
    {
      title: 'Active Claims',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Total Policies',
      value: '23,891',
      change: '+8.2%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'Claims Processed',
      value: '196',
      change: '+15.7%',
      trend: 'up',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      title: 'Fraud Detected',
      value: '23',
      change: '-5.2%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Premium Volume',
      value: '$12.4M',
      change: '+9.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Processing Time',
      value: '2.4 days',
      change: '-18.3%',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    }
  ];

  const claimsData = [
    { period: 'Week 1', count: 45, totalValue: 234000, averageValue: 5200 },
    { period: 'Week 2', count: 52, totalValue: 267000, averageValue: 5135 },
    { period: 'Week 3', count: 38, totalValue: 198000, averageValue: 5211 },
    { period: 'Week 4', count: 61, totalValue: 312000, averageValue: 5115 }
  ];

  const riskTrends = [
    { category: 'Auto', trend: 'increasing', riskScore: 65 },
    { category: 'Home', trend: 'stable', riskScore: 45 },
    { category: 'Commercial', trend: 'decreasing', riskScore: 38 }
  ];

  const fraudStats = {
    alertsGenerated: 23,
    investigationsOpened: 8,
    fraudConfirmed: 3,
    savingsEstimated: 145000
  };

  const policyMetrics = {
    newPolicies: 1247,
    renewals: 3891,
    cancellations: 234,
    premiumGrowth: 12.5
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      orange: 'bg-orange-50 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insurance Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor claims, policies, and fraud detection in real-time</p>
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {getTrendIcon(stat.trend)}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {stat.change} from last period
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Claims Volume Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('claims')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'claims' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Claims
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
            {claimsData.map((period, index) => {
              const maxValue = selectedMetric === 'claims' 
                ? Math.max(...claimsData.map(p => p.count))
                : Math.max(...claimsData.map(p => p.totalValue));
              const currentValue = selectedMetric === 'claims' ? period.count : period.totalValue;
              const percentage = (currentValue / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-700">
                    {period.period}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {selectedMetric === 'claims' 
                          ? period.count 
                          : `$${(period.totalValue / 1000).toFixed(0)}k`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment by Category</h3>
          <div className="space-y-4">
            {riskTrends.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{risk.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{risk.riskScore}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      risk.trend === 'increasing' ? 'bg-red-500' :
                      risk.trend === 'decreasing' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      risk.riskScore > 60 ? 'bg-red-500' :
                      risk.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${risk.riskScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Fraud Detection and Policy Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Detection Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Fraud Detection</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {fraudStats.alertsGenerated}
              </p>
              <p className="text-sm text-gray-600">Alerts Generated</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {fraudStats.investigationsOpened}
              </p>
              <p className="text-sm text-gray-600">Under Investigation</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {fraudStats.fraudConfirmed}
              </p>
              <p className="text-sm text-gray-600">Fraud Confirmed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ${fraudStats.savingsEstimated / 1000}k
              </p>
              <p className="text-sm text-gray-600">Estimated Savings</p>
            </div>
          </div>
        </div>

        {/* Policy Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Policy Performance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-900">New Policies</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  {policyMetrics.newPolicies.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+12%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-900">Renewals</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  {policyMetrics.renewals.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+8%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Premium Growth</p>
                <p className="text-sm text-gray-600">Year over year</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {policyMetrics.premiumGrowth}%
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Target: 10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}