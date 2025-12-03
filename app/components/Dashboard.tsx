'use client';

import React from 'react';
import { FileText, BarChart3, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

interface DashboardProps {
  totalFiles: number;
  processedFiles: number;
  totalInsights: number;
  keyMetrics: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export default function Dashboard({ totalFiles, processedFiles, totalInsights, keyMetrics }: DashboardProps) {
  const processingRate = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Files</p>
              <p className="text-2xl font-bold text-blue-900">{totalFiles}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Processed</p>
              <p className="text-2xl font-bold text-green-900">{processedFiles}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Insights Generated</p>
              <p className="text-2xl font-bold text-purple-900">{totalInsights}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Success Rate</p>
              <p className="text-2xl font-bold text-orange-900">{processingRate}%</p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-4 border-orange-200">
                <div 
                  className="w-full h-full rounded-full border-4 border-orange-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {keyMetrics.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Key Business Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  {getTrendIcon(metric.trend)}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {totalFiles > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Processing Progress</span>
            <span className="text-sm text-gray-500">{processedFiles} / {totalFiles}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${processingRate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}