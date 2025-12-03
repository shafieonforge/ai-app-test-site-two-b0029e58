'use client';

import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Lightbulb,
  Filter,
  Search,
  Download,
  Calendar,
  Star,
  AlertTriangle
} from 'lucide-react';

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
  onExport: () => void;
}

export default function InsightsList({ insights, onExport }: InsightsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'relevance'>('date');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'summary':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'metric':
        return <BarChart3 className="h-5 w-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'summary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'metric':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trend':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'anomaly':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'recommendation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categories = useMemo(() => {
    const cats = insights.map(insight => insight.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [insights]);

  const types = ['all', 'summary', 'metric', 'trend', 'anomaly', 'recommendation'];

  const filteredAndSortedInsights = useMemo(() => {
    let filtered = insights.filter(insight => {
      const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           insight.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || insight.type === filterType;
      const matchesCategory = filterCategory === 'all' || insight.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        case 'relevance':
          // Simple relevance based on type priority and confidence
          const typePriority: Record<string, number> = {
            anomaly: 5,
            recommendation: 4,
            trend: 3,
            metric: 2,
            summary: 1
          };
          const aScore = (typePriority[a.type] || 0) * 10 + a.confidence;
          const bScore = (typePriority[b.type] || 0) * 10 + b.confidence;
          return bScore - aScore;
        default:
          return 0;
      }
    });
  }, [insights, searchTerm, filterType, filterCategory, sortBy]);

  const insightStats = useMemo(() => {
    const total = insights.length;
    const byType = insights.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const avgConfidence = insights.length > 0 
      ? Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length)
      : 0;

    return { total, byType, avgConfidence };
  }, [insights]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-600">
            {insightStats.total} insights generated • {insightStats.avgConfidence}% avg confidence
          </p>
        </div>
        
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(insightStats.byType).map(([type, count]) => (
          <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              {getInsightIcon(type)}
              <span className="text-sm font-medium text-gray-600 capitalize">{type}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence' | 'relevance')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Newest First</option>
            <option value="confidence">Highest Confidence</option>
            <option value="relevance">Most Relevant</option>
          </select>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredAndSortedInsights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
            <p className="text-gray-600">
              {insights.length === 0 
                ? 'Upload and process documents to generate AI insights.'
                : 'No insights match your current filters.'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {getInsightIcon(insight.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {insight.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getTypeColor(insight.type)}`}>
                        {insight.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {insight.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {insight.fileName}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {insight.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(insight.metadata).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-gray-600">{key}: </span>
                        <span className="text-gray-700">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination would go here for large datasets */}
      {filteredAndSortedInsights.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredAndSortedInsights.length} of {insights.length} insights
        </div>
      )}
    </div>
  );
}