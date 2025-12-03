'use client';

import React, { useState } from 'react';
import { Search, Filter, FileText, BarChart3, Image, Download, Eye, Trash2, Calendar } from 'lucide-react';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'processed' | 'processing' | 'failed';
  insightCount: number;
  category?: string;
  tags?: string[];
}

interface DocumentLibraryProps {
  documents: Document[];
  onViewDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onDownloadInsights: (id: string) => void;
}

export default function DocumentLibrary({ 
  documents, 
  onViewDocument, 
  onDeleteDocument, 
  onDownloadInsights 
}: DocumentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'insights'>('date');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <BarChart3 className="h-5 w-5 text-green-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'insights':
          return b.insightCount - a.insightCount;
        default:
          return 0;
      }
    });

  const statusTypes = ['all', 'processed', 'processing', 'failed'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Document Library ({filteredAndSortedDocuments.length})
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'insights')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="insights">Most Insights</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className="p-6">
        {filteredAndSortedDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                  
                  {doc.insightCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <BarChart3 className="h-4 w-4" />
                      {doc.insightCount} insights generated
                    </div>
                  )}

                  {doc.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {doc.category}
                    </span>
                  )}

                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{doc.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onViewDocument(doc.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  
                  {doc.status === 'processed' && doc.insightCount > 0 && (
                    <button
                      onClick={() => onDownloadInsights(doc.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}