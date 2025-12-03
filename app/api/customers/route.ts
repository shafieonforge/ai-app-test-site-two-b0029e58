import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          contacts: true,
          _count: {
            select: {
              policies: true,
              claims: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.customer.count({ where })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const customer = await db.customer.create({
      data: {
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        ssn: data.ssn,
        ein: data.ein,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        phone: data.phone,
        email: data.email,
        address: data.address,
        contacts: {
          create: data.contacts?.map((contact: any) => ({
            type: contact.type,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            preferred: contact.preferred || false
          })) || []
        }
      },
      include: {
        contacts: true
      }
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}