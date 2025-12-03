'use client';

import React from 'react';
import { Shield, FileText, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';

export default function InsuranceDashboard() {
  const stats = [
    { label: 'Active Policies', value: '12,847', icon: Shield, color: 'blue' },
    { label: 'Open Claims', value: '342', icon: FileText, color: 'yellow' },
    { label: 'Premium Volume', value: '$2.4M', icon: DollarSign, color: 'green' },
    { label: 'Customer Satisfaction', value: '94.2%', icon: TrendingUp, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insurance Dashboard</h1>
        <p className="text-gray-600">Overview of your insurance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New claim filed', detail: 'CLM-789123 - Auto collision', time: '2 hours ago' },
            { action: 'Policy renewed', detail: 'POL-456789 - Home insurance', time: '4 hours ago' },
            { action: 'Fraud alert triggered', detail: 'Multiple claims pattern detected', time: '6 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.detail}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}