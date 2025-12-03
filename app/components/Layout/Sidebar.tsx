'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Settings,
  BarChart3,
  Calendar,
  Search,
  Archive,
  CheckSquare,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  userRole: string;
  onModuleChange: (module: string) => void;
  activeModule: string;
}

export default function Sidebar({ isCollapsed, userRole, onModuleChange, activeModule }: SidebarProps) {
  const navigationItems = [
    {
      section: 'Core Modules',
      items: [
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          icon: BarChart3,
          roles: ['admin', 'executive', 'underwriter', 'adjuster']
        },
        { 
          id: 'claims', 
          name: 'Claims Processing', 
          icon: FileText,
          roles: ['admin', 'adjuster', 'executive']
        },
        { 
          id: 'policies', 
          name: 'Policy Management', 
          icon: Shield,
          roles: ['admin', 'underwriter', 'executive']
        },
        { 
          id: 'underwriting', 
          name: 'Underwriting Intel', 
          icon: TrendingUp,
          roles: ['admin', 'underwriter', 'executive']
        }
      ]
    },
    {
      section: 'Risk & Compliance',
      items: [
        { 
          id: 'fraud', 
          name: 'Fraud Detection', 
          icon: AlertTriangle,
          roles: ['admin', 'adjuster', 'executive']
        },
        { 
          id: 'compliance', 
          name: 'Compliance', 
          icon: CheckSquare,
          roles: ['admin', 'auditor', 'executive']
        },
        { 
          id: 'analytics', 
          name: 'Analytics', 
          icon: DollarSign,
          roles: ['admin', 'executive']
        }
      ]
    },
    {
      section: 'System',
      items: [
        { 
          id: 'users', 
          name: 'User Management', 
          icon: Users,
          roles: ['admin']
        },
        { 
          id: 'settings', 
          name: 'Settings', 
          icon: Settings,
          roles: ['admin', 'executive']
        },
        { 
          id: 'archive', 
          name: 'Document Archive', 
          icon: Archive,
          roles: ['admin', 'auditor']
        }
      ]
    }
  ];

  const hasAccess = (roles: string[]) => {
    return roles.includes(userRole) || roles.includes('admin');
  };

  return (
    <div className={`bg-slate-900 text-white h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">InsureCore</h1>
              <p className="text-xs text-slate-400">Enterprise Platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-8">
        {navigationItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {section.section}
              </h3>
            )}
            <ul className="mt-2 space-y-1">
              {section.items.map((item) => {
                if (!hasAccess(item.roles)) return null;
                
                const Icon = item.icon;
                const active = activeModule === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onModuleChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{userRole}</p>
                <p className="text-xs text-slate-400">Role Access</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}