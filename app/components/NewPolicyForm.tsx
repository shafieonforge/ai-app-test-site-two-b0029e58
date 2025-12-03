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
  ArrowLeft
} from 'lucide-react';

export default function NewPolicyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [customers, setCustomers] = useState<any[]>([]);
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

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: FileText },
    { number: 2, title: 'Coverage Selection', icon: Shield },
    { number: 3, title: 'Insured Items', icon: Car },
    { number: 4, title: 'Additional Details', icon: User },
    { number: 5, title: 'Review & Submit', icon: Save }
  ];

  const productTypes = [
    { value: 'PERSONAL_AUTO', label: 'Personal Auto' },
    { value: 'HOMEOWNERS', label: 'Homeowners' },
    { value: 'RENTERS', label: 'Renters' },
    { value: 'COMMERCIAL_AUTO', label: 'Commercial Auto' },
    { value: 'COMMERCIAL_PROPERTY', label: 'Commercial Property' },
    { value: 'UMBRELLA', label: 'Umbrella' }
  ];

  const autoCoverages = [
    { code: 'BI', name: 'Bodily Injury Liability', type: 'LIABILITY', required: true },
    { code: 'PD', name: 'Property Damage Liability', type: 'LIABILITY', required: true },
    { code: 'COMP', name: 'Comprehensive', type: 'PHYSICAL_DAMAGE', required: false },
    { code: 'COLL', name: 'Collision', type: 'PHYSICAL_DAMAGE', required: false },
    { code: 'UM', name: 'Uninsured Motorist', type: 'LIABILITY', required: false },
    { code: 'PIP', name: 'Personal Injury Protection', type: 'MEDICAL', required: false }
  ];

  const homeCoverages = [
    { code: 'DWELLING', name: 'Dwelling', type: 'PROPERTY', required: true },
    { code: 'OTHER_STRUCTURES', name: 'Other Structures', type: 'PROPERTY', required: true },
    { code: 'PERSONAL_PROPERTY', name: 'Personal Property', type: 'PROPERTY', required: true },
    { code: 'LIABILITY', name: 'Personal Liability', type: 'LIABILITY', required: true },
    { code: 'MEDICAL_PAYMENTS', name: 'Medical Payments', type: 'MEDICAL', required: false }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.customerId) newErrors.customerId = 'Customer is required';
        if (!formData.productType) newErrors.productType = 'Product type is required';
        if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';
        if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';
        break;
      case 2:
        if (formData.coverages.length === 0) {
          newErrors.coverages = 'At least one coverage is required';
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
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Policy ${result.policy.policyNumber} created successfully!`);
        // Reset form or redirect
        setFormData({
          customerId: '',
          productType: '',
          effectiveDate: '',
          expirationDate: '',
          paymentPlan: 'ANNUAL',
          coverages: [],
          insuredItems: [],
          drivers: [],
          locations: []
        });
        setCurrentStep(1);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  const addCoverage = (coverage: any) => {
    setFormData(prev => ({
      ...prev,
      coverages: [...prev.coverages, {
        ...coverage,
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

  const getCoverageOptions = () => {
    if (formData.productType?.includes('AUTO')) return autoCoverages;
    if (formData.productType === 'HOMEOWNERS') return homeCoverages;
    return [];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Policy Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customerType === 'BUSINESS' 
                        ? customer.businessName
                        : `${customer.firstName} ${customer.lastName}`
                      }
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-red-600 text-sm mt-1">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type *
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Product Type</option>
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.productType && (
                  <p className="text-red-600 text-sm mt-1">{errors.productType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date *
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expirationDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.expirationDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.expirationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Plan
                </label>
                <select
                  value={formData.paymentPlan}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentPlan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PAID_IN_FULL">Paid in Full</option>
                  <option value="ANNUAL">Annual</option>
                  <option value="SEMI_ANNUAL">Semi-Annual</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        const availableCoverages = getCoverageOptions();
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Coverage Selection</h3>
              <div className="text-sm text-gray-600">
                Select coverages for this policy
              </div>
            </div>

            {/* Available Coverages */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Available Coverages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableCoverages
                  .filter(coverage => !formData.coverages.find(c => c.code === coverage.code))
                  .map(coverage => (
                    <button
                      key={coverage.code}
                      onClick={() => addCoverage(coverage)}
                      className="flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Plus className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900">{coverage.name}</div>
                        <div className="text-sm text-gray-500">
                          {coverage.required && <span className="text-red-500">Required • </span>}
                          {coverage.type.replace('_', ' ')}
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{coverage.name}</h5>
                      <button
                        onClick={() => removeCoverage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Coverage Limit
                        </label>
                        <input
                          type="text"
                          value={coverage.limit}
                          onChange={(e) => updateCoverage(index, 'limit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 250000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deductible
                        </label>
                        <input
                          type="text"
                          value={coverage.deductible}
                          onChange={(e) => updateCoverage(index, 'deductible', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Annual Premium
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={coverage.premium}
                            onChange={(e) => updateCoverage(index, 'premium', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
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
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Insured Items</h3>
              <button
                onClick={() => {
                  const newItem = formData.productType?.includes('AUTO') 
                    ? {
                        type: 'VEHICLE',
                        year: '',
                        make: '',
                        model: '',
                        vin: '',
                        vehicleType: '',
                        coveredAmount: ''
                      }
                    : {
                        type: 'BUILDING',
                        address: { street: '', city: '', state: '', zipCode: '' },
                        constructionType: '',
                        coveredAmount: ''
                      };

                  setFormData(prev => ({
                    ...prev,
                    insuredItems: [...prev.insuredItems, newItem]
                  }));
                }}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            {formData.insuredItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    {item.type === 'VEHICLE' ? `Vehicle ${index + 1}` : `Property ${index + 1}`}
                  </h4>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      insuredItems: prev.insuredItems.filter((_, i) => i !== index)
                    }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {item.type === 'VEHICLE' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={item.year}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          insuredItems: prev.insuredItems.map((itm, i) => 
                            i === index ? { ...itm, year: e.target.value } : itm
                          )
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <input
                        type="text"
                        value={item.make}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          insuredItems: prev.insuredItems.map((itm, i) => 
                            i === index ? { ...itm, make: e.target.value } : itm
                          )
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        value={item.model}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          insuredItems: prev.insuredItems.map((itm, i) => 
                            i === index ? { ...itm, model: e.target.value } : itm
                          )
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                      <input
                        type="text"
                        value={item.vin}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          insuredItems: prev.insuredItems.map((itm, i) => 
                            i === index ? { ...itm, vin: e.target.value } : itm
                          )
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          value={item.address?.street || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            insuredItems: prev.insuredItems.map((itm, i) => 
                              i === index ? { 
                                ...itm, 
                                address: { ...itm.address, street: e.target.value }
                              } : itm
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Construction Type</label>
                        <select
                          value={item.constructionType || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            insuredItems: prev.insuredItems.map((itm, i) => 
                              i === index ? { ...itm, constructionType: e.target.value } : itm
                            )
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="FRAME">Frame</option>
                          <option value="MASONRY">Masonry</option>
                          <option value="BRICK">Brick</option>
                          <option value="CONCRETE">Concrete</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {formData.insuredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No insured items added yet. Click "Add Item" to get started.
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
            
            {formData.productType?.includes('AUTO') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Drivers</h4>
                  <button
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
                        licenseState: ''
                      }]
                    }))}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Driver
                  </button>
                </div>

                {formData.drivers.map((driver, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">Driver {index + 1}</h5>
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          drivers: prev.drivers.filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
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
              </div>
            )}
          </div>
        );

      case 5:
        const totalPremium = formData.coverages.reduce(
          (sum, coverage) => sum + parseFloat(coverage.premium || '0'), 
          0
        );

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Review Policy Details</h3>
            
            {/* Policy Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Policy Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product Type:</span>
                  <span className="ml-2 font-medium">
                    {productTypes.find(t => t.value === formData.productType)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Policy Period:</span>
                  <span className="ml-2 font-medium">
                    {formData.effectiveDate} to {formData.expirationDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Payment Plan:</span>
                  <span className="ml-2 font-medium">{formData.paymentPlan.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Premium:</span>
                  <span className="ml-2 font-medium text-lg">${totalPremium.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Coverage Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Coverages</h4>
              <div className="space-y-2">
                {formData.coverages.map((coverage, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{coverage.name}</span>
                    <span className="font-medium">
                      {coverage.limit && `$${parseInt(coverage.limit).toLocaleString()}`}
                      {coverage.deductible && ` / $${parseInt(coverage.deductible).toLocaleString()} ded`}
                      {' - '}${parseFloat(coverage.premium || '0').toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Summary */}
            {formData.insuredItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Insured Items</h4>
                <div className="space-y-2 text-sm">
                  {formData.insuredItems.map((item, index) => (
                    <div key={index}>
                      {item.type === 'VEHICLE' 
                        ? `${item.year} ${item.make} ${item.model}`
                        : `Property at ${item.address?.street}`
                      }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Steps */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Insurance Policy</h2>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {step.number < steps.length && (
                    <div className={`w-24 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {currentStep === 5 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create Policy
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}