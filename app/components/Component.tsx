'use client';

import React, { useState } from 'react';
import Sidebar from './Layout/Sidebar';
import TopBar from './Layout/TopBar';
import InsuranceDashboard from './Dashboard/InsuranceDashboard';
import ClaimsProcessor from './Claims/ClaimsProcessor';
import PolicyManagement from './Policy/PolicyManagement';
import FraudDetection from './Fraud/FraudDetection';
import ComplianceCenter from './Compliance/ComplianceCenter';
import UserManagement from './Admin/UserManagement';
import AnalyticsCenter from './Analytics/AnalyticsCenter';

export default function Component() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentModule, setCurrentModule] = useState('dashboard');

  // Mock user data
  const currentUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acmeinsurance.com',
    role: 'adjuster',
    organization: 'Acme Insurance Corp'
  };

  // Mock notifications
  const notifications = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'High-Value Claim Alert',
      message: 'Claim #CLM-789123 requires immediate review - $75,000 loss amount',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Processing Complete',
      message: 'Batch processing of 45 documents completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false
    },
    {
      id: '3',
      type: 'error' as const,
      title: 'Fraud Alert',
      message: 'Suspicious pattern detected in claim #CLM-456789',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true
    }
  ];

  const renderCurrentModule = () => {
    switch (currentModule) {
      case 'claims':
        return (
          <ClaimsProcessor
            onDocumentProcessed={(doc) => console.log('Document processed:', doc)}
            onFraudDetected={(alert) => console.log('Fraud detected:', alert)}
          />
        );
      case 'policies':
        return <PolicyManagement />;
      case 'fraud':
        return <FraudDetection />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <AnalyticsCenter />;
      case 'dashboard':
      default:
        return <InsuranceDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        userRole={currentUser.role}
        onModuleChange={setCurrentModule}
        activeModule={currentModule}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={currentUser}
          notifications={notifications}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentModule()}
        </main>
      </div>
    </div>
  );
}