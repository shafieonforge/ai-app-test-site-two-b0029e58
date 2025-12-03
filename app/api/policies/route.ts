import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      customerId,
      productType,
      effectiveDate,
      expirationDate,
      paymentPlan = 'ANNUAL',
      coverages = [],
      insuredItems = [],
      drivers = [],
      locations = []
    } = data;

    // Generate policy number
    const policyNumber = await generatePolicyNumber();

    // Calculate term in months
    const effective = new Date(effectiveDate);
    const expiration = new Date(expirationDate);
    const policyTerm = Math.round(
      (expiration.getTime() - effective.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Calculate total premium
    const totalPremium = coverages.reduce(
      (sum: number, coverage: any) => sum + parseFloat(coverage.premium || '0'), 
      0
    );

    // Create policy record (simplified - would normally use database transaction)
    const policy = {
      id: generateId(),
      policyNumber,
      customerId,
      productType,
      effectiveDate: effective.toISOString(),
      expirationDate: expiration.toISOString(),
      policyTerm,
      status: 'QUOTE',
      paymentPlan,
      totalPremium,
      basePremium: totalPremium,
      fees: calculateFees(totalPremium, productType),
      taxes: calculateTaxes(totalPremium),
      quotedDate: new Date().toISOString(),
      coverages: coverages.map((c: any, index: number) => ({
        id: generateId(),
        ...c,
        effectiveDate: effective.toISOString(),
        expirationDate: expiration.toISOString()
      })),
      insuredItems: insuredItems.map((item: any, index: number) => ({
        id: generateId(),
        itemNumber: (index + 1).toString(),
        ...item
      })),
      drivers: drivers.map((driver: any) => ({
        id: generateId(),
        ...driver
      }))
    };

    return NextResponse.json({
      success: true,
      policy,
      message: `Policy quote ${policyNumber} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json(
      { error: 'Failed to create policy' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const productType = searchParams.get('productType');
    const search = searchParams.get('search');

    // Mock response for now - replace with actual database query
    const mockPolicies = [
      {
        id: '1',
        policyNumber: 'POL-2024-000001',
        productType: 'PERSONAL_AUTO',
        customer: {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          customerType: 'INDIVIDUAL'
        },
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        status: 'ACTIVE',
        totalPremium: 1200,
        paymentPlan: 'MONTHLY',
        riskScore: 45,
        complianceStatus: 'COMPLIANT',
        coverages: [
          { id: '1', code: 'BI', name: 'Bodily Injury Liability', premium: 400 },
          { id: '2', code: 'PD', name: 'Property Damage Liability', premium: 200 }
        ],
        insuredItems: [
          { id: '1', type: 'VEHICLE', description: '2022 Honda Accord' }
        ],
        _count: { claims: 0, endorsements: 0 },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    return NextResponse.json({
      policies: mockPolicies,
      pagination: {
        page,
        limit,
        total: mockPolicies.length,
        pages: 1
      }
    });

  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies' }, 
      { status: 500 }
    );
  }
}

// Helper functions
async function generatePolicyNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999999) + 1;
  return `POL-${year}-${sequence.toString().padStart(6, '0')}`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function calculateFees(premium: number, productType: string): number {
  const feeRates: Record<string, number> = {
    'PERSONAL_AUTO': 25,
    'HOMEOWNERS': 35,
    'COMMERCIAL_AUTO': 50,
    'COMMERCIAL_PROPERTY': 75
  };
  
  return feeRates[productType] || 25;
}

function calculateTaxes(premium: number): number {
  return premium * 0.02; // 2% tax rate
}