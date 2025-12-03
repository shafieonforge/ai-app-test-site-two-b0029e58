'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Calendar
} from 'lucide-react';

export default function AnalyticsCenter() {
  const metrics = [
    { label: 'Claims Processed', value: '1,247', change: '+12%', trend: 'up' as const },
    { label: 'Fraud Detected', value: '23', change: '-8%', trend: 'down' as const },
    { label: 'Processing Time', value: '4.2 days', change: '-15%', trend: 'down' as const },
    { label: 'Customer Satisfaction', value: '94.2%', change: '+2%', trend: 'up' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Center</h1>
        <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const isPositive = metric.trend === 'up';
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-4 w-4 ${
                      isPositive ? 'text-green-500' : 'text-red-500 rotate-180'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Type</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would be rendered here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would be rendered here</p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {[
            { name: 'Monthly Claims Report', date: '2024-01-15', type: 'PDF' },
            { name: 'Fraud Analysis Q1', date: '2024-01-10', type: 'Excel' },
            { name: 'Customer Satisfaction Survey', date: '2024-01-08', type: 'PDF' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.type} • {report.date}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}