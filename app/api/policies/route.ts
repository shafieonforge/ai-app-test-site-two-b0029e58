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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.policyType = type;
    if (search) {
      where.OR = [
        { policyNumber: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { businessName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [policies, total] = await Promise.all([
      db.policy.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          coverages: true,
          claims: true,
          _count: {
            select: {
              claims: true,
              documents: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.policy.count({ where })
    ]);

    return NextResponse.json({
      policies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
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
    
    // Generate policy number
    const policyNumber = `POL-${Date.now().toString().slice(-8)}`;

    const policy = await db.policy.create({
      data: {
        policyNumber,
        customerId: data.customerId,
        createdById: session.user.id,
        policyType: data.policyType,
        status: 'PENDING',
        effectiveDate: new Date(data.effectiveDate),
        expirationDate: new Date(data.expirationDate),
        premiumAmount: parseFloat(data.premiumAmount),
        deductible: parseFloat(data.deductible),
        complianceStatus: 'PENDING_REVIEW',
        riskScore: data.riskScore || 50,
        coverages: {
          create: data.coverages?.map((coverage: any) => ({
            type: coverage.type,
            limit: parseFloat(coverage.limit),
            deductible: parseFloat(coverage.deductible),
            premium: parseFloat(coverage.premium)
          })) || []
        }
      },
      include: {
        customer: true,
        coverages: true,
        createdBy: true
      }
    });

    // Create activity log
    await db.activity.create({
      data: {
        entityType: 'POLICY',
        entityId: policy.id,
        userId: session.user.id,
        action: 'CREATED',
        description: `Policy ${policyNumber} created`,
        metadata: { policyType: policy.policyType, status: policy.status }
      }
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}