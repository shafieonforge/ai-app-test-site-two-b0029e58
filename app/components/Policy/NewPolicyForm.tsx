'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Car, 
  Home, 
  DollarSign, 
  Calendar,
  Plus, 
  X, 
  Save, 
  FileText,
  ArrowRight,
  ArrowLeft,
  Building,
  Users
} from 'lucide-react';

interface NewPolicyFormProps {
  onSubmit: (policyData: any) => Promise<void>;
  onCancel: () => void;
  customers: any[];
}

export default function NewPolicyForm({ onSubmit, onCancel, customers }: NewPolicyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Basic Info
    customerId: '',
    productType: '',
    effectiveDate: '',
    expirationDate: '',
    paymentPlan: 'ANNUAL',
    
    // Coverages
    coverages: [] as any[],
    
    // Insured Items (vehicles, properties, etc.)
    insuredItems: [] as any[],
    
    // Drivers (for auto policies)
    drivers: [] as any[],
    
    // Locations (for property policies)
    locations: [] as any[]
  });

  // Auto-populate expiration date when effective date changes
  useEffect(() => {
    if (formData.effectiveDate) {
      const effectiveDate = new Date(formData.effectiveDate);
      const expirationDate = new Date(effectiveDate);
      expirationDate.setFullYear(effectiveDate.getFullYear() + 1);
      setFormData(prev => ({
        ...prev,
        expirationDate: expirationDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.effectiveDate]);

  const steps = [
    { number: 1, title: 'Basic Information', icon: FileText, description: 'Customer and policy details' },
    { number: 2, title: 'Coverage Selection', icon: Shield, description: 'Choose insurance coverages' },
    { number: 3, title: 'Insured Items', icon: Car, description: 'Add vehicles or properties' },
    { number: 4, title: 'Additional Details', icon: Users, description: 'Drivers and locations' },
    { number: 5, title: 'Review & Submit', icon: Save, description: 'Review and create policy' }
  ];

  const productTypes = [
    { value: 'PERSONAL_AUTO', label: 'Personal Auto', icon: Car, description: 'Individual vehicle coverage' },
    { value: 'HOMEOWNERS', label: 'Homeowners', icon: Home, description: 'Primary residence coverage' },
    { value: 'RENTERS', label: 'Renters', icon: Home, description: 'Tenant personal property coverage' },
    { value: 'COMMERCIAL_AUTO', label: 'Commercial Auto', icon: Car, description: 'Business vehicle fleet' },
    { value: 'COMMERCIAL_PROPERTY', label: 'Commercial Property', icon: Building, description: 'Business property coverage' },
    { value: 'UMBRELLA', label: 'Umbrella', icon: Shield, description: 'Additional liability protection' }
  ];

  const coverageTemplates = {
    PERSONAL_AUTO: [
      { code: 'BI', name: 'Bodily Injury Liability', type: 'LIABILITY', required: true, limits: ['25000/50000', '50000/100000', '100000/300000', '250000/500000'] },
      { code: 'PD', name: 'Property Damage Liability', type: 'LIABILITY', required: true, limits: ['25000', '50000', '100000', '250000'] },
      { code: 'COMP', name: 'Comprehensive', type: 'PHYSICAL_DAMAGE', required: false, deductibles: ['250', '500', '1000'] },
      { code: 'COLL', name: 'Collision', type: 'PHYSICAL_DAMAGE', required: false, deductibles: ['250', '500', '1000'] },
      { code: 'UM', name: 'Uninsured Motorist', type: 'LIABILITY', required: false, limits: ['25000/50000', '50000/100000', '100000/300000'] },
      { code: 'PIP', name: 'Personal Injury Protection', type: 'MEDICAL', required: false, limits: ['2500', '5000', '10000'] }
    ],
    HOMEOWNERS: [
      { code: 'DWELLING', name: 'Dwelling Coverage', type: 'PROPERTY', required: true, limits: ['100000', '200000', '300000', '400000', '500000'] },
      { code: 'OTHER_STRUCTURES', name: 'Other Structures', type: 'PROPERTY', required: true, limits: ['10000', '20000', '30000', '40000', '50000'] },
      { code: 'PERSONAL_PROPERTY', name: 'Personal Property', type: 'PROPERTY', required: true, limits: ['50000', '75000', '100000', '150000', '200000'] },
      { code: 'LIABILITY', name: 'Personal Liability', type: 'LIABILITY', required: true, limits: ['100000', '300000', '500000'] },
      { code: 'MEDICAL_PAYMENTS', name: 'Medical Payments to Others', type: 'MEDICAL', required: false, limits: ['1000', '2500', '5000'] }
    ],
    COMMERCIAL_AUTO: [
      { code: 'BI', name: 'Bodily Injury Liability', type: 'LIABILITY', required: true, limits: ['500000/1000000', '1000000/2000000'] },
      { code: 'PD', name: 'Property Damage Liability', type: 'LIABILITY', required: true, limits: ['500000', '1000000'] },
      { code: 'COMP', name: 'Comprehensive', type: 'PHYSICAL_DAMAGE', required: false, deductibles: ['500', '1000', '2500'] },
      { code: 'COLL', name: 'Collision', type: 'PHYSICAL_DAMAGE', required: false, deductibles: ['500', '1000', '2500'] },
      { code: 'CARGO', name: 'Cargo Coverage', type: 'CARGO', required: false, limits: ['50000', '100000', '250000'] }
    ]
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.customerId) newErrors.customerId = 'Customer selection is required';
        if (!formData.productType) newErrors.productType = 'Product type is required';
        if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';
        if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';
        if (new Date(formData.effectiveDate) >= new Date(formData.expirationDate)) {
          newErrors.expirationDate = 'Expiration date must be after effective date';
        }
        break;
      case 2:
        if (formData.coverages.length === 0) {
          newErrors.coverages = 'At least one coverage is required';
        }
        // Check required coverages
        const availableCoverages = getCoverageOptions();
        const requiredCoverages = availableCoverages.filter(c => c.required);
        const selectedCoverages = formData.coverages.map(c => c.code);
        const missingRequired = requiredCoverages.filter(c => !selectedCoverages.includes(c.code));
        if (missingRequired.length > 0) {
          newErrors.coverages = `Required coverages missing: ${missingRequired.map(c => c.name).join(', ')}`;
        }
        break;
      case 3:
        if (formData.productType?.includes('AUTO') && formData.insuredItems.length === 0) {
          newErrors.insuredItems = 'At least one vehicle is required for auto policies';
        }
        if (formData.productType?.includes('HOMEOWNERS') && formData.insuredItems.length === 0) {
          newErrors.insuredItems = 'Property information is required for homeowners policies';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to create policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoverageOptions = () => {
    const type = formData.productType as keyof typeof coverageTemplates;
    return coverageTemplates[type] || [];
  };

  const addCoverage = (coverageTemplate: any) => {
    setFormData(prev => ({
      ...prev,
      coverages: [...prev.coverages, {
        ...coverageTemplate,
        limit: '',
        deductible: '',
        premium: ''
      }]
    }));
  };

  const removeCoverage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coverages: prev.coverages.filter((_, i) => i !== index)
    }));
  };

  const updateCoverage = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      coverages: prev.coverages.map((coverage, i) => 
        i === index ? { ...coverage, [field]: value } : coverage
      )
    }));
  };

  const addInsuredItem = () => {
    const newItem = formData.productType?.includes('AUTO') 
      ? {
          type: 'VEHICLE',
          year: '',
          make: '',
          model: '',
          vin: '',
          vehicleType: 'SEDAN',
          garagingZip: '',
          coveredAmount: ''
        }
      : {
          type: 'BUILDING',
          address: { 
            street: '', 
            city: '', 
            state: '', 
            zipCode: '' 
          },
          constructionType: 'FRAME',
          occupancyType: 'OWNER_OCCUPIED',
          squareFootage: '',
          yearBuilt: '',
          coveredAmount: ''
        };

    setFormData(prev => ({
      ...prev,
      insuredItems: [...prev.insuredItems, newItem]
    }));
  };

  const removeInsuredItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      insuredItems: prev.insuredItems.filter((_, i) => i !== index)
    }));
  };

  const updateInsuredItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      insuredItems: prev.insuredItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Policy Information</h3>
              <p className="text-gray-600">Let's start with the basic policy details</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a customer...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customerType === 'BUSINESS' 
                        ? customer.businessName
                        : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email
                      } ({customer.email})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-red-600 text-sm">{errors.customerId}</p>
                )}
              </div>

              {/* Policy Dates */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effective Date *
                    </label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.effectiveDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.effectiveDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.effectiveDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.expirationDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.expirationDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.expirationDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Plan
                  </label>
                  <select
                    value={formData.paymentPlan}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentPlan: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PAID_IN_FULL">Paid in Full (Discount)</option>
                    <option value="ANNUAL">Annual</option>
                    <option value="SEMI_ANNUAL">Semi-Annual</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Type Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Insurance Product *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productTypes.map(type => {
                  const Icon = type.icon;
                  const isSelected = formData.productType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, productType: type.value }))}
                      className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                        <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {type.label}
                        </h4>
                      </div>
                      <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.productType && (
                <p className="text-red-600 text-sm">{errors.productType}</p>
              )}
            </div>
          </div>
        );

      case 2:
        const availableCoverages = getCoverageOptions();
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coverage Selection</h3>
              <p className="text-gray-600">Choose the coverages for this {formData.productType?.toLowerCase().replace('_', ' ')} policy</p>
            </div>

            {/* Available Coverages */}
            {availableCoverages.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Available Coverages</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCoverages
                      .filter(coverage => !formData.coverages.find(c => c.code === coverage.code))
                      .map(coverage => (
                        <button
                          key={coverage.code}
                          type="button"
                          onClick={() => addCoverage(coverage)}
                          className="flex items-start gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <Plus className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{coverage.name}</span>
                              {coverage.required && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {coverage.type.replace('_', ' ')} Coverage
                            </div>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                </div>

                {/* Selected Coverages */}
                {formData.coverages.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Selected Coverages</h4>
                    {formData.coverages.map((coverage, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-gray-900">{coverage.name}</h5>
                            {coverage.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          {!coverage.required && (
                            <button
                              type="button"
                              onClick={() => removeCoverage(index)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Coverage Limit */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Coverage Limit
                            </label>
                            {coverage.limits ? (
                              <select
                                value={coverage.limit}
                                onChange={(e) => updateCoverage(index, 'limit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select limit...</option>
                                {coverage.limits.map((limit: string) => (
                                  <option key={limit} value={limit}>
                                    ${limit.replace('/', ' / $')}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={coverage.limit}
                                onChange={(e) => updateCoverage(index, 'limit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter limit amount"
                              />
                            )}
                          </div>

                          {/* Deductible */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deductible
                            </label>
                            {coverage.deductibles ? (
                              <select
                                value={coverage.deductible}
                                onChange={(e) => updateCoverage(index, 'deductible', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select deductible...</option>
                                {coverage.deductibles.map((deductible: string) => (
                                  <option key={deductible} value={deductible}>
                                    ${deductible}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={coverage.deductible}
                                onChange={(e) => updateCoverage(index, 'deductible', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter deductible"
                              />
                            )}
                          </div>

                          {/* Premium */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Annual Premium
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="number"
                                value={coverage.premium}
                                onChange={(e) => updateCoverage(index, 'premium', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.coverages && (
                  <p className="text-red-600 text-sm">{errors.coverages}</p>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Insured Items</h3>
              <p className="text-gray-600">
                Add the {formData.productType?.includes('AUTO') ? 'vehicles' : 'properties'} to be covered by this policy
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {formData.productType?.includes('AUTO') ? 'Vehicles' : 'Properties'}
              </h4>
              <button
                type="button"
                onClick={addInsuredItem}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add {formData.productType?.includes('AUTO') ? 'Vehicle' : 'Property'}
              </button>
            </div>

            {formData.insuredItems.length > 0 ? (
              <div className="space-y-6">
                {formData.insuredItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="font-medium text-gray-900">
                        {item.type === 'VEHICLE' ? `Vehicle ${index + 1}` : `Property ${index + 1}`}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeInsuredItem(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {item.type === 'VEHICLE' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                          <input
                            type="number"
                            value={item.year}
                            onChange={(e) => updateInsuredItem(index, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="1900"
                            max={new Date().getFullYear() + 2}
                            placeholder="2024"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                          <input
                            type="text"
                            value={item.make}
                            onChange={(e) => updateInsuredItem(index, 'make', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Honda"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                          <input
                            type="text"
                            value={item.model}
                            onChange={(e) => updateInsuredItem(index, 'model', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Accord"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                          <input
                            type="text"
                            value={item.vin}
                            onChange={(e) => updateInsuredItem(index, 'vin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="17-digit VIN"
                            maxLength={17}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                          <select
                            value={item.vehicleType}
                            onChange={(e) => updateInsuredItem(index, 'vehicleType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="SEDAN">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="TRUCK">Truck</option>
                            <option value="COUPE">Coupe</option>
                            <option value="CONVERTIBLE">Convertible</option>
                            <option value="WAGON">Wagon</option>
                            <option value="VAN">Van</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Garaging ZIP Code</label>
                          <input
                            type="text"
                            value={item.garagingZip}
                            onChange={(e) => updateInsuredItem(index, 'garagingZip', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="12345"
                            maxLength={5}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                            <input
                              type="text"
                              value={item.address?.street || ''}
                              onChange={(e) => updateInsuredItem(index, 'address', { 
                                ...item.address, 
                                street: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="123 Main Street"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              value={item.address?.city || ''}
                              onChange={(e) => updateInsuredItem(index, 'address', { 
                                ...item.address, 
                                city: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Anytown"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <select
                              value={item.address?.state || ''}
                              onChange={(e) => updateInsuredItem(index, 'address', { 
                                ...item.address, 
                                state: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select state...</option>
                              <option value="AL">Alabama</option>
                              <option value="CA">California</option>
                              <option value="FL">Florida</option>
                              <option value="NY">New York</option>
                              <option value="TX">Texas</option>
                              {/* Add more states as needed */}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              value={item.address?.zipCode || ''}
                              onChange={(e) => updateInsuredItem(index, 'address', { 
                                ...item.address, 
                                zipCode: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="12345"
                              maxLength={10}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Construction Type</label>
                            <select
                              value={item.constructionType}
                              onChange={(e) => updateInsuredItem(index, 'constructionType', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="FRAME">Frame</option>
                              <option value="MASONRY">Masonry</option>
                              <option value="BRICK">Brick</option>
                              <option value="CONCRETE">Concrete</option>
                              <option value="STEEL">Steel</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
                            <input
                              type="number"
                              value={item.squareFootage}
                              onChange={(e) => updateInsuredItem(index, 'squareFootage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="2000"
                              min="1"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                            <input
                              type="number"
                              value={item.yearBuilt}
                              onChange={(e) => updateInsuredItem(index, 'yearBuilt', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="1990"
                              min="1800"
                              max={new Date().getFullYear()}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                {formData.productType?.includes('AUTO') ? (
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                ) : (
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {formData.productType?.includes('AUTO') ? 'vehicles' : 'properties'} added yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Add {formData.productType?.includes('AUTO') ? 'Vehicle' : 'Property'}" to get started.
                </p>
                <button
                  type="button"
                  onClick={addInsuredItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add {formData.productType?.includes('AUTO') ? 'Vehicle' : 'Property'}
                </button>
              </div>
            )}

            {errors.insuredItems && (
              <p className="text-red-600 text-sm">{errors.insuredItems}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Additional Details</h3>
              <p className="text-gray-600">Add drivers, locations, and other policy details</p>
            </div>
            
            {formData.productType?.includes('AUTO') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Drivers</h4>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      drivers: [...prev.drivers, {
                        type: 'NAMED',
                        firstName: '',
                        lastName: '',
                        dateOfBirth: '',
                        gender: '',
                        maritalStatus: '',
                        licenseNumber: '',
                        licenseState: '',
                        yearsLicensed: ''
                      }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Driver
                  </button>
                </div>

                {formData.drivers.map((driver, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="font-medium text-gray-900">Driver {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          drivers: prev.drivers.filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={driver.firstName}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, firstName: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={driver.lastName}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, lastName: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                        <input
                          type="date"
                          value={driver.dateOfBirth}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, dateOfBirth: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={driver.gender}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, gender: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                        <select
                          value={driver.maritalStatus}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, maritalStatus: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="SINGLE">Single</option>
                          <option value="MARRIED">Married</option>
                          <option value="DIVORCED">Divorced</option>
                          <option value="WIDOWED">Widowed</option>
                          <option value="SEPARATED">Separated</option>
                          <option value="DOMESTIC_PARTNER">Domestic Partner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                        <input
                          type="text"
                          value={driver.licenseNumber}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            drivers: prev.drivers.map((d, i) => 
                              i === index ? { ...d, licenseNumber: e.target.value } : d
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.drivers.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No drivers added yet. Add at least one driver for this auto policy.</p>
                  </div>
                )}
              </div>
            )}

            {!formData.productType?.includes('AUTO') && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No additional details required</h3>
                <p className="text-gray-600">This policy type doesn't require additional driver or location information.</p>
              </div>
            )}
          </div>
        );

      case 5:
        const totalPremium = formData.coverages.reduce(
          (sum, coverage) => sum + parseFloat(coverage.premium || '0'), 
          0
        );

        const selectedCustomer = customers.find(c => c.id === formData.customerId);
        const selectedProduct = productTypes.find(p => p.value === formData.productType);

        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h3>
              <p className="text-gray-600">Please review all policy details before submitting</p>
            </div>
            
            {/* Policy Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-blue-700">Customer:</span>
                    <p className="font-medium text-blue-900">
                      {selectedCustomer?.customerType === 'BUSINESS' 
                        ? selectedCustomer?.businessName
                        : `${selectedCustomer?.firstName || ''} ${selectedCustomer?.lastName || ''}`.trim()
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-700">Product Type:</span>
                    <p className="font-medium text-blue-900">{selectedProduct?.label}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-700">Payment Plan:</span>
                    <p className="font-medium text-blue-900">{formData.paymentPlan.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-blue-700">Policy Period:</span>
                    <p className="font-medium text-blue-900">
                      {new Date(formData.effectiveDate).toLocaleDateString()} - {new Date(formData.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-700">Total Annual Premium:</span>
                    <p className="text-2xl font-bold text-blue-900">${totalPremium.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Summary */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Coverage Details</h4>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Coverage</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Limit</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Deductible</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.coverages.map((coverage, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{coverage.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {coverage.limit ? `$${coverage.limit.replace('/', ' / $')}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {coverage.deductible ? `$${coverage.deductible}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                          ${parseFloat(coverage.premium || '0').toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900">Total Annual Premium</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">${totalPremium.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Items Summary */}
            {formData.insuredItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Insured {formData.productType?.includes('AUTO') ? 'Vehicles' : 'Properties'}
                </h4>
                <div className="space-y-3">
                  {formData.insuredItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      {item.type === 'VEHICLE' ? (
                        <Car className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Home className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-900">
                        {item.type === 'VEHICLE' 
                          ? `${item.year || ''} ${item.make || ''} ${item.model || ''}`.trim() || 'Vehicle details pending'
                          : item.address?.street || 'Property address pending'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drivers Summary */}
            {formData.drivers.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Listed Drivers</h4>
                <div className="space-y-3">
                  {formData.drivers.map((driver, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {`${driver.firstName || ''} ${driver.lastName || ''}`.trim() || `Driver ${index + 1}`}
                        {driver.dateOfBirth && (
                          <span className="text-gray-500 ml-2">
                            (Age: {Math.floor((new Date().getTime() - new Date(driver.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Steps */}
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Insurance Policy</h2>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isClickable = currentStep >= step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div 
                  className={`flex flex-col items-center cursor-pointer ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => isClickable && setCurrentStep(step.number)}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 transition-all ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between p-8 border-t border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {currentStep === 5 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating Policy...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Policy
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}