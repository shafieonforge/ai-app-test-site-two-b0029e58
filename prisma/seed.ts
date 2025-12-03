import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adjuster = await prisma.user.create({
    data: {
      email: 'sarah.johnson@acmeinsurance.com',
      name: 'Sarah Johnson',
      role: 'ADJUSTER',
      department: 'Claims',
      organization: 'Acme Insurance Corp',
      permissions: ['claims:read', 'claims:write', 'policies:read']
    }
  });

  const underwriter = await prisma.user.create({
    data: {
      email: 'mike.chen@acmeinsurance.com',
      name: 'Mike Chen',
      role: 'UNDERWRITER',
      department: 'Underwriting',
      organization: 'Acme Insurance Corp',
      permissions: ['policies:read', 'policies:write', 'customers:read']
    }
  });

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      type: 'INDIVIDUAL',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      dateOfBirth: new Date('1985-03-15'),
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      }
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      type: 'BUSINESS',
      businessName: 'Tech Solutions Inc.',
      ein: '12-3456789',
      email: 'info@techsolutions.com',
      phone: '(555) 987-6543',
      address: {
        street: '456 Business Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      }
    }
  });

  // Create policies
  const policy1 = await prisma.policy.create({
    data: {
      policyNumber: 'POL-12345678',
      customerId: customer1.id,
      createdById: underwriter.id,
      policyType: 'AUTO',
      status: 'ACTIVE',
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2024-12-31'),
      premiumAmount: 1200.00,
      deductible: 500.00,
      riskScore: 45,
      complianceStatus: 'COMPLIANT',
      coverages: {
        create: [
          {
            type: 'Liability',
            limit: 100000.00,
            deductible: 0.00,
            premium: 600.00
          },
          {
            type: 'Comprehensive',
            limit: 25000.00,
            deductible: 500.00,
            premium: 400.00
          },
          {
            type: 'Collision',
            limit: 25000.00,
            deductible: 500.00,
            premium: 200.00
          }
        ]
      }
    }
  });

  const policy2 = await prisma.policy.create({
    data: {
      policyNumber: 'POL-87654321',
      customerId: customer2.id,
      createdById: underwriter.id,
      policyType: 'COMMERCIAL',
      status: 'ACTIVE',
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2024-12-31'),
      premiumAmount: 5000.00,
      deductible: 2500.00,
      riskScore: 65,
      complianceStatus: 'COMPLIANT',
      coverages: {
        create: [
          {
            type: 'General Liability',
            limit: 1000000.00,
            deductible: 2500.00,
            premium: 3000.00
          },
          {
            type: 'Property',
            limit: 500000.00,
            deductible: 2500.00,
            premium: 2000.00
          }
        ]
      }
    }
  });

  // Create claims
  await prisma.claim.create({
    data: {
      claimNumber: 'CLM-20241001',
      policyId: policy1.id,
      customerId: customer1.id,
      assignedTo: adjuster.id,
      lossDate: new Date('2024-01-15'),
      reportedDate: new Date('2024-01-16'),
      status: 'OPEN',
      lossAmount: 3500.00,
      reserveAmount: 5000.00,
      description: 'Rear-end collision at intersection',
      location: {
        street: '789 Oak Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702'
      },
      participants: {
        create: [
          {
            type: 'insured',
            name: 'John Smith',
            role: 'Driver',
            contact: {
              phone: '(555) 123-4567',
              email: 'john.smith@email.com'
            }
          }
        ]
      }
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });