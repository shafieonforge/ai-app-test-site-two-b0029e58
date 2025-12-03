import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Mock data for demo since we don't have a real database yet
    const mockPolicies = [
      {
        id: '1',
        policyNumber: 'POL-12345678',
        policyType: 'AUTO',
        status: 'ACTIVE',
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        premiumAmount: 1200,
        deductible: 500,
        riskScore: 45,
        customer: {
          firstName: 'John',
          lastName: 'Smith',
          businessName: null,
          email: 'john.smith@email.com'
        },
        coverages: [],
        _count: { claims: 2, documents: 5 }
      },
      {
        id: '2',
        policyNumber: 'POL-87654321',
        policyType: 'HOME',
        status: 'PENDING',
        effectiveDate: '2024-02-01',
        expirationDate: '2025-01-31',
        premiumAmount: 2400,
        deductible: 1000,
        riskScore: 65,
        customer: {
          firstName: null,
          lastName: null,
          businessName: 'Tech Solutions Inc.',
          email: 'info@techsolutions.com'
        },
        coverages: [],
        _count: { claims: 0, documents: 3 }
      }
    ];

    let filteredPolicies = mockPolicies;

    // Apply filters
    if (status && status !== 'all') {
      filteredPolicies = filteredPolicies.filter(p => p.status === status);
    }
    if (type && type !== 'all') {
      filteredPolicies = filteredPolicies.filter(p => p.policyType === type);
    }
    if (search) {
      filteredPolicies = filteredPolicies.filter(p => 
        p.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        (p.customer.firstName && p.customer.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (p.customer.lastName && p.customer.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (p.customer.businessName && p.customer.businessName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return NextResponse.json({
      policies: filteredPolicies,
      pagination: {
        page,
        limit,
        total: filteredPolicies.length,
        pages: Math.ceil(filteredPolicies.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate policy number
    const policyNumber = `POL-${Date.now().toString().slice(-8)}`;

    const mockPolicy = {
      id: Date.now().toString(),
      policyNumber,
      customerId: data.customerId,
      policyType: data.policyType,
      status: 'PENDING',
      effectiveDate: data.effectiveDate,
      expirationDate: data.expirationDate,
      premiumAmount: parseFloat(data.premiumAmount),
      deductible: parseFloat(data.deductible),
      riskScore: data.riskScore || 50,
      customer: {
        firstName: 'New',
        lastName: 'Customer',
        businessName: null,
        email: 'customer@email.com'
      },
      coverages: [],
      _count: { claims: 0, documents: 0 }
    };

    return NextResponse.json(mockPolicy, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}