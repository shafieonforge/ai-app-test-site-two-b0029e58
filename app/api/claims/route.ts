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
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { policy: { policyNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [claims, total] = await Promise.all([
      db.claim.findMany({
        where,
        skip,
        take: limit,
        include: {
          policy: {
            include: { customer: true }
          },
          adjuster: true,
          payments: true,
          documents: true,
          _count: {
            select: {
              documents: true,
              payments: true
            }
          }
        },
        orderBy: { reportedDate: 'desc' }
      }),
      db.claim.count({ where })
    ]);

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
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
    
    // Generate claim number
    const claimNumber = `CLM-${Date.now().toString().slice(-8)}`;

    const claim = await db.claim.create({
      data: {
        claimNumber,
        policyId: data.policyId,
        customerId: data.customerId,
        lossDate: new Date(data.lossDate),
        reportedDate: new Date(),
        status: 'OPEN',
        description: data.description,
        lossAmount: data.lossAmount ? parseFloat(data.lossAmount) : null,
        reserveAmount: data.reserveAmount ? parseFloat(data.reserveAmount) : null,
        location: data.location || null,
        participants: {
          create: data.participants?.map((p: any) => ({
            type: p.type,
            name: p.name,
            role: p.role,
            contact: p.contact
          })) || []
        }
      },
      include: {
        policy: { include: { customer: true } },
        participants: true
      }
    });

    // Auto-assign based on workload (simple round-robin)
    const adjusters = await db.user.findMany({
      where: { role: 'ADJUSTER' },
      include: { _count: { select: { assignedClaims: true } } },
      orderBy: { assignedClaims: { _count: 'asc' } }
    });

    if (adjusters.length > 0) {
      await db.claim.update({
        where: { id: claim.id },
        data: { assignedTo: adjusters[0].id }
      });
    }

    // Create activity log
    await db.activity.create({
      data: {
        entityType: 'CLAIM',
        entityId: claim.id,
        userId: session.user.id,
        action: 'CREATED',
        description: `Claim ${claimNumber} filed`,
        metadata: { lossAmount: claim.lossAmount, status: claim.status }
      }
    });

    // Check for potential fraud
    await checkFraudIndicators(claim);

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkFraudIndicators(claim: any) {
  // Simple fraud detection logic
  const indicators = [];
  
  if (claim.lossAmount && claim.lossAmount > 50000) {
    indicators.push('High value claim');
  }

  // Check for multiple claims from same customer in short period
  const recentClaims = await db.claim.count({
    where: {
      customerId: claim.customerId,
      reportedDate: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days
      }
    }
  });

  if (recentClaims > 3) {
    indicators.push('Multiple recent claims');
  }

  if (indicators.length > 0) {
    await db.fraudAlert.create({
      data: {
        type: 'SUSPICIOUS_PATTERN',
        severity: claim.lossAmount > 75000 ? 'HIGH' : 'MEDIUM',
        description: `Potential fraud detected: ${indicators.join(', ')}`,
        entityType: 'CLAIM',
        entityId: claim.id,
        riskScore: Math.min(100, indicators.length * 25 + (claim.lossAmount > 50000 ? 25 : 0)),
        investigationRequired: true
      }
    });
  }
}