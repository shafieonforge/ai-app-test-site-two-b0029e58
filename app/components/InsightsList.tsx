'use client';

import React, { useState } from 'react';
import { Brain, Search, Filter, Download, TrendingUp, FileText, BarChart3, Lightbulb } from 'lucide-react';
import { Insight } from '../types';

interface InsightsListProps {
  insights: Insight[];
  onExport: () => void;
}

export default function InsightsList({ insights, onExport }: InsightsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'type'>('date');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'metric':
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'summary':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'anomaly':
        return <Brain className="h-5 w-5 text-red-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
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
      const matchesCategory = filterCategory === 'all' || insight.category === filterCategory;
      const matchesType = filterType === 'all' || insight.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const categories = Array.from(new Set(insights.map(i => i.category)));
  const types = Array.from(new Set(insights.map(i => i.type)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              AI Insights ({filteredAndSortedInsights.length})
            </h2>
          </div>
          
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export All
          </button>
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence' | 'type')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Latest First</option>
              <option value="confidence">Highest Confidence</option>
              <option value="type">By Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="p-6">
        {filteredAndSortedInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No insights found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedInsights.map((insight) => (
              <div
                key={insight.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {insight.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{insight.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>From: {insight.fileName}</span>
                        <span>•</span>
                        <span>Category: {insight.category}</span>
                        <span>•</span>
                        <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      </div>
                      
                      {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Details:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(insight.metadata).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                </span>
                                <span className="ml-1 font-medium text-gray-900">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}