'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export interface Insight {
  id: string;
  fileName: string;
  type: 'summary' | 'metric' | 'trend' | 'anomaly' | 'recommendation';
  title: string;
  content: string;
  confidence: number;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface InsightsListProps {
  insights: Insight[];
  onExport?: () => void;
}

export default function InsightsList({ insights, onExport }: InsightsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence'>('timestamp');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'recommendation':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'anomaly':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'recommendation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'metric':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredAndSortedInsights = insights
    .filter(insight => {
      const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || insight.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.confidence - a.confidence;
    });

  const insightTypes = ['all', ...new Set(insights.map(i => i.type))];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            AI Insights ({filteredAndSortedInsights.length})
          </h2>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {insightTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'confidence')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="timestamp">Newest First</option>
              <option value="confidence">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedInsights.length === 0 ? (
          <div className="p-8 text-center">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No insights found matching your criteria.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredAndSortedInsights.map((insight) => (
              <div
                key={insight.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getInsightIcon(insight.type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-500">{insight.fileName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getInsightTypeColor(insight.type)}`}>
                      {insight.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}%
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{insight.content}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{insight.category}</span>
                  <span>{new Date(insight.timestamp).toLocaleString()}</span>
                </div>

                {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded border">
                    <p className="text-xs font-medium text-gray-600 mb-1">Additional Data:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      {Object.entries(insight.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}