'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, BarChart3, Image } from 'lucide-react';

export interface ProcessingFile {
  id: string;
  name: string;
  type: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress: number;
  insights?: string[];
  error?: string;
}

interface ProcessingStatusProps {
  files: ProcessingFile[];
  isProcessing: boolean;
}

export default function ProcessingStatus({ files, isProcessing }: ProcessingStatusProps) {
  if (files.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <BarChart3 className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed').length;
  const totalFiles = files.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Processing Status</h2>
        <div className="text-sm text-gray-500">
          {completedFiles} of {totalFiles} completed
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className={`border rounded-lg p-4 transition-colors duration-200 ${getStatusColor(file.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {getFileTypeIcon(file.type)}
                <span className="font-medium text-gray-900">{file.name}</span>
              </div>
              {getStatusIcon(file.status)}
            </div>

            {file.status === 'processing' && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, file.progress))}%` }}
                />
              </div>
            )}

            {file.status === 'error' && file.error && (
              <p className="text-sm text-red-600 mt-2">{file.error}</p>
            )}

            {file.status === 'completed' && file.insights && file.insights.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded border">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {file.insights.slice(0, 3).map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}