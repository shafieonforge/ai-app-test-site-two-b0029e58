'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Brain, BarChart3, Zap } from 'lucide-react';
import FileUpload from './FileUpload';
import ProcessingStatus from './ProcessingStatus';
import Dashboard from './Dashboard';
import InsightsList from './InsightsList';
import DocumentLibrary from './DocumentLibrary';

// Re-export types for consistency
export type { ProcessingFile } from './ProcessingStatus';
export type { Insight } from './InsightsList';
export type { Document } from './DocumentLibrary';

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function Component() {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'insights'>('upload');

  // Simulate file processing
  const simulateProcessing = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    const newProcessingFiles: ProcessingFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      status: 'waiting',
      progress: 0
    }));
    
    setProcessingFiles(newProcessingFiles);

    try {
      // Process each file
      for (let i = 0; i < newProcessingFiles.length; i++) {
        const file = newProcessingFiles[i];
        
        // Start processing
        setProcessingFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProcessingFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        }

        // Generate insights
        const mockInsights = generateMockInsights(file, files[i]);
        
        setProcessingFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'completed',
            insights: mockInsights.map(insight => insight.title)
          } : f
        ));

        // Add insights to global list
        setInsights(prev => [...prev, ...mockInsights]);

        // Add to document library
        const newDocument: Document = {
          id: file.id,
          name: file.name,
          type: file.type,
          size: files[i].size,
          uploadDate: new Date(),
          status: 'processed',
          insightCount: mockInsights.length,
          category: getDocumentCategory(file.type),
          tags: generateTags(file.name, file.type)
        };

        setDocuments(prev => [...prev, newDocument]);
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateMockInsights = useCallback((file: ProcessingFile, originalFile: File): Insight[] => {
    const baseInsights: Insight[] = [];
    const timestamp = new Date();
    const baseId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      baseInsights.push({
        id: `${baseId}-1`,
        fileName: file.name,
        type: 'metric',
        title: 'Revenue Growth Detected',
        content: 'Analysis shows 15% quarter-over-quarter revenue increase with strong performance in Q3.',
        confidence: 92,
        category: 'Financial Performance',
        timestamp,
        metadata: { growthRate: '15%', period: 'Q3 2024' }
      });

      baseInsights.push({
        id: `${baseId}-2`,
        fileName: file.name,
        type: 'trend',
        title: 'Cost Optimization Opportunity',
        content: 'Operating expenses increased by 8% while revenue grew 15%, indicating room for cost optimization.',
        confidence: 85,
        category: 'Cost Analysis',
        timestamp,
        metadata: { costIncrease: '8%', revenueGrowth: '15%' }
      });
    } else if (file.type === 'text/plain') {
      baseInsights.push({
        id: `${baseId}-1`,
        fileName: file.name,
        type: 'summary',
        title: 'Document Summary',
        content: 'Key topics identified include strategic planning, market analysis, and competitive positioning.',
        confidence: 88,
        category: 'Content Analysis',
        timestamp,
        metadata: { wordCount: 2450, keyTopics: 3 }
      });

      baseInsights.push({
        id: `${baseId}-2`,
        fileName: file.name,
        type: 'recommendation',
        title: 'Action Items Identified',
        content: 'Document contains 5 actionable recommendations for improving market position.',
        confidence: 79,
        category: 'Strategic Planning',
        timestamp,
        metadata: { actionItems: 5 }
      });
    } else if (file.type.startsWith('image/')) {
      baseInsights.push({
        id: `${baseId}-1`,
        fileName: file.name,
        type: 'summary',
        title: 'OCR Text Extraction Complete',
        content: 'Successfully extracted text content from image. Identified key financial figures and dates.',
        confidence: 91,
        category: 'OCR Processing',
        timestamp,
        metadata: { textLength: 1250, figuresFound: 12 }
      });
    }

    return baseInsights;
  }, []);

  const getDocumentCategory = useCallback((type: string): string => {
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Financial Data';
    if (type === 'text/plain') return 'Text Document';
    if (type.startsWith('image/')) return 'Scanned Document';
    if (type.includes('pdf')) return 'PDF Document';
    return 'Other';
  }, []);

  const generateTags = useCallback((name: string, type: string): string[] => {
    const tags: string[] = [];
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('revenue') || lowerName.includes('sales')) tags.push('Revenue');
    if (lowerName.includes('cost') || lowerName.includes('expense')) tags.push('Costs');
    if (lowerName.includes('budget')) tags.push('Budget');
    if (lowerName.includes('report')) tags.push('Report');
    if (lowerName.includes('analysis')) tags.push('Analysis');
    
    if (type.includes('excel')) tags.push('Spreadsheet');
    if (type.startsWith('image/')) tags.push('OCR');
    
    return tags.slice(0, 3);
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      simulateProcessing(files);
    }
  }, [simulateProcessing]);

  const handleViewDocument = useCallback((id: string) => {
    console.log('Viewing document:', id);
  }, []);

  const handleDeleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setInsights(prev => prev.filter(insight => {
      const doc = documents.find(d => d.id === id);
      return !(doc && doc.name === insight.fileName);
    }));
  }, [documents]);

  const handleDownloadInsights = useCallback((id: string) => {
    console.log('Downloading insights for:', id);
  }, []);

  const handleExportInsights = useCallback(() => {
    console.log('Exporting all insights');
  }, []);

  const keyMetrics: DashboardMetric[] = useMemo(() => [
    {
      label: 'Total Revenue',
      value: '$2.4M',
      change: '+15% from last quarter',
      trend: 'up'
    },
    {
      label: 'Processing Efficiency',
      value: '94%',
      change: '+2% improvement',
      trend: 'up'
    },
    {
      label: 'Data Accuracy',
      value: '99.2%',
      change: 'Stable',
      trend: 'neutral'
    }
  ], []);

  const tabConfig = useMemo(() => [
    { key: 'upload', label: 'Upload Documents', icon: FileText },
    { key: 'library', label: 'Document Library', icon: BarChart3 },
    { key: 'insights', label: 'AI Insights', icon: Brain }
  ], []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BI Document Processor
                </h1>
                <p className="text-sm text-gray-500">
                  AI-powered business intelligence from your documents
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{insights.length} insights generated</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        <Dashboard
          totalFiles={documents.length}
          processedFiles={documents.filter(d => d.status === 'processed').length}
          totalInsights={insights.length}
          keyMetrics={keyMetrics}
        />

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8" role="tablist">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                role="tab"
                aria-selected={activeTab === key}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Documents
                </h2>
                <FileUpload onFilesSelected={handleFilesSelected} />
              </div>
              
              <div className="space-y-6">
                <ProcessingStatus files={processingFiles} isProcessing={isProcessing} />
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <DocumentLibrary
              documents={documents}
              onViewDocument={handleViewDocument}
              onDeleteDocument={handleDeleteDocument}
              onDownloadInsights={handleDownloadInsights}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsList
              insights={insights}
              onExport={handleExportInsights}
            />
          )}
        </div>
      </div>
    </div>
  );
}