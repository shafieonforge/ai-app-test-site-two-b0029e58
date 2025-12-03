import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Validate customer exists
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' }, 
        { status: 400 }
      );
    }

    // Generate policy number
    const policyNumber = await generatePolicyNumber();

    // Calculate term in months
    const effective = new Date(effectiveDate);
    const expiration = new Date(expirationDate);
    const policyTerm = Math.round(
      (expiration.getTime() - effective.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Create policy with all components in transaction
    const policy = await db.$transaction(async (tx) => {
      // Create main policy record
      const newPolicy = await tx.policy.create({
        data: {
          policyNumber,
          customerId,
          agentId: session.user.role === 'AGENT' ? session.user.id : null,
          productType,
          effectiveDate: effective,
          expirationDate: expiration,
          policyTerm,
          status: 'QUOTE',
          paymentPlan,
          quotedDate: new Date()
        }
      });

      // Add coverages
      if (coverages.length > 0) {
        await tx.policyCoverage.createMany({
          data: coverages.map((coverage: any) => ({
            policyId: newPolicy.id,
            coverageCode: coverage.code,
            coverageName: coverage.name,
            coverageType: coverage.type,
            limit: coverage.limit ? parseFloat(coverage.limit) : null,
            deductible: coverage.deductible ? parseFloat(coverage.deductible) : null,
            premium: parseFloat(coverage.premium || '0'),
            effectiveDate: effective,
            expirationDate: expiration
          }))
        });
      }

      // Add insured items (vehicles, properties, etc.)
      if (insuredItems.length > 0) {
        await tx.insuredItem.createMany({
          data: insuredItems.map((item: any, index: number) => ({
            policyId: newPolicy.id,
            itemType: item.type,
            itemNumber: (index + 1).toString(),
            year: item.year ? parseInt(item.year) : null,
            make: item.make,
            model: item.model,
            vin: item.vin,
            vehicleType: item.vehicleType,
            address: item.address,
            coveredAmount: item.coveredAmount ? parseFloat(item.coveredAmount) : null
          }))
        });
      }

      // Add drivers (for auto policies)
      if (drivers.length > 0) {
        await tx.policyDriver.createMany({
          data: drivers.map((driver: any) => ({
            policyId: newPolicy.id,
            driverType: driver.type || 'NAMED',
            firstName: driver.firstName,
            lastName: driver.lastName,
            dateOfBirth: new Date(driver.dateOfBirth),
            gender: driver.gender,
            maritalStatus: driver.maritalStatus,
            licenseNumber: driver.licenseNumber,
            licenseState: driver.licenseState,
            yearsLicensed: driver.yearsLicensed ? parseInt(driver.yearsLicensed) : null
          }))
        });
      }

      // Add locations (for property policies)
      if (locations.length > 0) {
        await tx.policyLocation.createMany({
          data: locations.map((location: any, index: number) => ({
            policyId: newPolicy.id,
            locationNumber: (index + 1).toString(),
            locationType: location.type || 'PRIMARY',
            address: location.address,
            constructionType: location.constructionType,
            occupancyType: location.occupancyType,
            buildingLimit: location.buildingLimit ? parseFloat(location.buildingLimit) : null,
            contentsLimit: location.contentsLimit ? parseFloat(location.contentsLimit) : null
          }))
        });
      }

      // Calculate total premium
      const totalPremium = coverages.reduce(
        (sum: number, coverage: any) => sum + parseFloat(coverage.premium || '0'), 
        0
      );

      // Update policy with premium information
      await tx.policy.update({
        where: { id: newPolicy.id },
        data: {
          basePremium: totalPremium,
          totalPremium: totalPremium, // Add taxes/fees calculation here
          fees: calculateFees(totalPremium, productType),
          taxes: calculateTaxes(totalPremium, customer.address)
        }
      });

      // Create initial transaction record
      await tx.policyTransaction.create({
        data: {
          policyId: newPolicy.id,
          transactionType: 'NEW_BUSINESS',
          effectiveDate: effective,
          totalChange: totalPremium,
          description: 'New policy quote created',
          processedBy: session.user.id
        }
      });

      return newPolicy;
    });

    // Trigger underwriting rules
    await runUnderwritingRules(policy);

    // Generate policy documents
    await generatePolicyDocuments(policy);

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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const status = searchParams.get('status');
    const productType = searchParams.get('productType');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (status && status !== 'all') where.status = status;
    if (productType && productType !== 'all') where.productType = productType;
    if (search) {
      where.OR = [
        { policyNumber: { contains: search, mode: 'insensitive' } },
        { customer: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { businessName: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    // Role-based filtering
    if (session.user.role === 'AGENT') {
      where.agentId = session.user.id;
    }

    const [policies, total] = await Promise.all([
      db.policy.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          agent: true,
          underwriter: true,
          coverages: true,
          insuredItems: true,
          _count: {
            select: {
              claims: true,
              endorsements: true
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
    return NextResponse.json(
      { error: 'Failed to fetch policies' }, 
      { status: 500 }
    );
  }
}

// Helper functions
async function generatePolicyNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const lastPolicy = await db.policy.findFirst({
    where: {
      policyNumber: { startsWith: `POL-${year}` }
    },
    orderBy: { policyNumber: 'desc' }
  });

  let sequence = 1;
  if (lastPolicy) {
    const lastSequence = parseInt(lastPolicy.policyNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `POL-${year}-${sequence.toString().padStart(6, '0')}`;
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

function calculateTaxes(premium: number, address: any): number {
  // State-specific tax calculations
  const stateTaxRates: Record<string, number> = {
    'CA': 0.025,  // 2.5%
    'NY': 0.02,   // 2.0%
    'TX': 0.0225, // 2.25%
    'FL': 0.0175  // 1.75%
  };
  
  const taxRate = stateTaxRates[address?.state] || 0.02;
  return premium * taxRate;
}

async function runUnderwritingRules(policy: any) {
  // Implement underwriting rules engine
  // Check for auto-bind criteria, referrals, etc.
  
  // Example: Auto-bind for low-risk policies
  const riskScore = calculateRiskScore(policy);
  
  if (riskScore <= 30 && policy.totalPremium <= 2000) {
    await db.policy.update({
      where: { id: policy.id },
      data: { 
        bindingAuthority: 'AUTO_BIND',
        riskScore,
        underwritingTier: 'PREFERRED'
      }
    });
  } else {
    await db.policy.update({
      where: { id: policy.id },
      data: { 
        bindingAuthority: 'UNDERWRITER_REVIEW',
        riskScore,
        underwritingTier: riskScore <= 50 ? 'STANDARD' : 'NON_STANDARD'
      }
    });
  }
}

function calculateRiskScore(policy: any): number {
  // Implement risk scoring algorithm
  // Consider factors like location, coverage limits, driver history, etc.
  return Math.floor(Math.random() * 100); // Placeholder
}

async function generatePolicyDocuments(policy: any) {
  // Generate required policy documents
  const documents = [
    { type: 'POLICY_CONTRACT', name: 'Policy Declarations', required: true },
    { type: 'COVERAGE_SUMMARY', name: 'Coverage Summary', required: true },
    { type: 'TERMS_CONDITIONS', name: 'Terms and Conditions', required: true }
  ];

  await db.policyDocument.createMany({
    data: documents.map(doc => ({
      policyId: policy.id,
      documentType: doc.type,
      documentName: doc.name,
      fileName: `${policy.policyNumber}_${doc.type}.pdf`,
      filePath: `/documents/policies/${policy.policyNumber}/`,
      isRequired: doc.required,
      generatedDate: new Date()
    }))
  });
}