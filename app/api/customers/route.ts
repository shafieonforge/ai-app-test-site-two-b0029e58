import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock customer data
    const mockCustomers = [
      {
        id: '1',
        type: 'INDIVIDUAL',
        firstName: 'John',
        lastName: 'Smith',
        businessName: null,
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        contacts: [],
        _count: { policies: 2, claims: 1 }
      },
      {
        id: '2',
        type: 'BUSINESS',
        firstName: null,
        lastName: null,
        businessName: 'Tech Solutions Inc.',
        email: 'info@techsolutions.com',
        phone: '(555) 987-6543',
        contacts: [],
        _count: { policies: 1, claims: 0 }
      }
    ];

    return NextResponse.json({
      customers: mockCustomers,
      pagination: {
        page: 1,
        limit,
        total: mockCustomers.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}