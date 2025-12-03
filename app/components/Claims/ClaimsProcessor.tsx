'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Image,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Download,
  Eye,
  Flag
} from 'lucide-react';

interface ClaimDocument {
  id: string;
  claimNumber: string;
  policyNumber: string;
  documentType: 'incident_report' | 'estimate' | 'photos' | 'police_report' | 'medical_records';
  extractedData: {
    incidentDate?: Date;
    lossAmount?: number;
    damageDescription?: string;
    parties?: any[];
    location?: any;
  };
  confidence: number;
  flags: string[];
  processingStatus: 'pending' | 'processed' | 'review_required' | 'approved';
}

interface ClaimsProcessorProps {
  onDocumentProcessed: (document: ClaimDocument) => void;
  onFraudDetected: (alert: any) => void;
}

export default function ClaimsProcessor({ onDocumentProcessed, onFraudDetected }: ClaimsProcessorProps) {
  const [processingFiles, setProcessingFiles] = useState<any[]>([]);
  const [processedClaims, setProcessedClaims] = useState<ClaimDocument[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<ClaimDocument | null>(null);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    const newProcessingFiles = fileArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      status: 'processing',
      progress: 0
    }));
    
    setProcessingFiles(newProcessingFiles);

    for (const file of fileArray) {
      await processClaimDocument(file);
    }

    setProcessingFiles([]);
  };

  const processClaimDocument = async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockClaimData: ClaimDocument = {
      id: Math.random().toString(36).substr(2, 9),
      claimNumber: `CLM-${Date.now().toString().slice(-6)}`,
      policyNumber: `POL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      documentType: getDocumentType(file.name),
      extractedData: generateMockClaimData(file.name),
      confidence: Math.floor(Math.random() * 20) + 80,
      flags: generateFlags(),
      processingStatus: 'processed'
    };

    if (mockClaimData.extractedData.lossAmount && mockClaimData.extractedData.lossAmount > 50000) {
      const fraudAlert = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'excessive_claims',
        severity: 'high',
        description: 'High-value claim detected requiring additional review',
        documentIds: [mockClaimData.id],
        riskScore: 75,
        investigationRequired: true
      };
      setFraudAlerts(prev => [...prev, fraudAlert]);
      onFraudDetected(fraudAlert);
    }

    setProcessedClaims(prev => [...prev, mockClaimData]);
    onDocumentProcessed(mockClaimData);
  };

  const getDocumentType = (filename: string): ClaimDocument['documentType'] => {
    const lower = filename.toLowerCase();
    if (lower.includes('police') || lower.includes('accident')) return 'police_report';
    if (lower.includes('estimate') || lower.includes('repair')) return 'estimate';
    if (lower.includes('photo') || lower.includes('image')) return 'photos';
    if (lower.includes('medical') || lower.includes('hospital')) return 'medical_records';
    return 'incident_report';
  };

  const generateMockClaimData = (filename: string) => {
    return {
      incidentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lossAmount: Math.floor(Math.random() * 75000) + 5000,
      damageDescription: getDamageDescription(filename),
      parties: [
        {
          name: 'John Smith',
          relationship: 'insured',
          phone: '(555) 123-4567',
          email: 'john.smith@email.com'
        }
      ],
      location: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      }
    };
  };

  const getDamageDescription = (filename: string): string => {
    const descriptions = [
      'Rear-end collision with moderate damage to bumper and trunk',
      'Single vehicle accident - impact with tree, front-end damage',
      'Water damage to basement due to pipe burst',
      'Hail damage to vehicle roof and hood',
      'Fire damage to kitchen area, smoke damage throughout home'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateFlags = (): string[] => {
    const possibleFlags = ['review_required', 'high_value', 'multiple_parties', 'prior_claims'];
    return possibleFlags.filter(() => Math.random() > 0.7);
  };

  const getDocumentIcon = (type: ClaimDocument['documentType']) => {
    switch (type) {
      case 'photos':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'police_report':
        return <Flag className="h-5 w-5 text-red-500" />;
      case 'estimate':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'medical_records':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'review_required':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Claims Document Processing</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload claim documents for AI-powered analysis and data extraction
          </p>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors relative">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop claim documents here
            </p>
            <p className="text-sm text-gray-600">
              Support for: Police reports, Estimates, Photos, Medical records, Incident reports
            </p>
          </div>

          {/* Processing Status */}
          {processingFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900">Processing Documents...</h3>
              {processingFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-900">Fraud Alerts Detected</h3>
          </div>
          <div className="space-y-2">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                <div>
                  <p className="font-medium text-red-900">{alert.description}</p>
                  <p className="text-sm text-red-700">Risk Score: {alert.riskScore}%</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Investigate
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Claims */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Processed Claims ({processedClaims.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {processedClaims.map((claim) => (
            <div key={claim.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getDocumentIcon(claim.documentType)}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        Claim #{claim.claimNumber}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(claim.processingStatus)}`}>
                        {claim.processingStatus.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {claim.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {claim.extractedData.incidentDate?.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        ${claim.extractedData.lossAmount?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {claim.extractedData.location?.city}, {claim.extractedData.location?.state}
                      </div>
                    </div>
                    
                    {claim.flags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Flag className="h-4 w-4 text-orange-500" />
                        <div className="flex gap-1">
                          {claim.flags.map((flag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              {flag.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedClaim(claim)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {processedClaims.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>No claims processed yet. Upload documents to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Claim Details - {selectedClaim.claimNumber}
              </h3>
              <button 
                onClick={() => setSelectedClaim(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Claim Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Number:</span>
                      <span className="font-medium">{selectedClaim.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Type:</span>
                      <span className="font-medium capitalize">{selectedClaim.documentType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loss Amount:</span>
                      <span className="font-medium">${selectedClaim.extractedData.lossAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incident Date:</span>
                      <span className="font-medium">{selectedClaim.extractedData.incidentDate?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Damage Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedClaim.extractedData.damageDescription}
                  </p>
                </div>
              </div>

              {selectedClaim.extractedData.parties && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Parties Involved</h4>
                  <div className="space-y-2">
                    {selectedClaim.extractedData.parties.map((party, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{party.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{party.relationship}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {party.phone} • {party.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                  Approve Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}