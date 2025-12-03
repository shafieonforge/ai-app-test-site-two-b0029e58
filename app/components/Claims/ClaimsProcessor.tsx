'use client';

import React, { useState } from 'react';
import { FileText, AlertTriangle, Search, Filter, Plus } from 'lucide-react';

interface ClaimsProcessorProps {
  onDocumentProcessed: (doc: any) => void;
  onFraudDetected: (alert: any) => void;
}

export default function ClaimsProcessor({ onDocumentProcessed, onFraudDetected }: ClaimsProcessorProps) {
  const [claims, setClaims] = useState([
    {
      id: '1',
      claimNumber: 'CLM-20241001',
      status: 'OPEN',
      lossAmount: 15000,
      description: 'Auto collision claim',
      reportedDate: new Date().toISOString(),
      policyNumber: 'POL-12345678'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Processing</h1>
          <p className="text-gray-600">Process insurance claims and detect fraud</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Claim
        </button>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Open</option>
              <option>Investigating</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loss Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{claim.claimNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.policyNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${claim.lossAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}