import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Mock customers data - replace with actual database query
    const customers = [
      { 
        id: '1', 
        firstName: 'John', 
        lastName: 'Smith', 
        email: 'john.smith@email.com',
        customerType: 'INDIVIDUAL'
      },
      { 
        id: '2', 
        firstName: 'Jane', 
        lastName: 'Doe', 
        email: 'jane.doe@email.com',
        customerType: 'INDIVIDUAL'
      },
      { 
        id: '3', 
        businessName: 'Acme Delivery Corp', 
        email: 'info@acmedelivery.com',
        customerType: 'BUSINESS'
      },
      { 
        id: '4', 
        firstName: 'Bob', 
        lastName: 'Johnson', 
        email: 'bob.johnson@email.com',
        customerType: 'INDIVIDUAL'
      },
      { 
        id: '5', 
        businessName: 'Tech Solutions LLC', 
        email: 'contact@techsolutions.com',
        customerType: 'BUSINESS'
      }
    ];

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
    
    // Mock customer creation - replace with actual database insertion
    const customer = {
      id: Math.random().toString(36).substring(2),
      ...data,
      createdAt: new Date().toISOString()
    };

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