import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        businessName: true,
        email: true,
        customerType: true
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' },
        { businessName: 'asc' }
      ]
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const customer = await db.customer.create({
      data: {
        ...data,
        address: JSON.stringify(data.address) // Ensure address is stored as JSON
      }
    });

    return NextResponse.json({
      success: true,
      customer,
      message: 'Customer created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}