import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const policy = await db.policy.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          include: { contacts: true }
        },
        coverages: true,
        endorsements: true,
        claims: {
          include: { payments: true }
        },
        documents: true,
        transactions: true,
        createdBy: true
      }
    });

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const policy = await db.policy.update({
      where: { id: params.id },
      data: {
        status: data.status,
        premiumAmount: data.premiumAmount ? parseFloat(data.premiumAmount) : undefined,
        deductible: data.deductible ? parseFloat(data.deductible) : undefined,
        riskScore: data.riskScore,
        complianceStatus: data.complianceStatus,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      },
      include: {
        customer: true,
        coverages: true,
        claims: true
      }
    });

    // Log activity
    await db.activity.create({
      data: {
        entityType: 'POLICY',
        entityId: policy.id,
        userId: session.user.id,
        action: 'UPDATED',
        description: `Policy ${policy.policyNumber} updated`,
        metadata: data
      }
    });

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error updating policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}