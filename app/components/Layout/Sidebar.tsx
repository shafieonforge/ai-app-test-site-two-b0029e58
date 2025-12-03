'use client';

import React from 'react';
import {
  BarChart3,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  userRole: string;
  onModuleChange: (module: string) => void;
  activeModule: string;
}

export default function Sidebar({ isCollapsed, userRole, onModuleChange, activeModule }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      roles: ['admin', 'underwriter', 'adjuster', 'executive', 'auditor']
    },
    {
      id: 'claims',
      label: 'Claims',
      icon: FileText,
      roles: ['admin', 'adjuster', 'executive']
    },
    {
      id: 'policies',
      label: 'Policies',
      icon: Shield,
      roles: ['admin', 'underwriter', 'executive']
    },
    {
      id: 'fraud',
      label: 'Fraud Detection',
      icon: AlertTriangle,
      roles: ['admin', 'adjuster', 'auditor']
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: CheckCircle,
      roles: ['admin', 'auditor', 'executive']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: Brain,
      roles: ['admin', 'executive', 'auditor']
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">InsureCore</h1>
              <p className="text-xs text-gray-400">Enterprise Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
}