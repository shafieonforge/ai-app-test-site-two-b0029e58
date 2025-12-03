import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@insurecore.com' },
    update: {},
    create: {
      email: 'admin@insurecore.com',
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@insurecore.com' },
    update: {},
    create: {
      email: 'agent@insurecore.com',
      name: 'John Agent',
      role: 'AGENT'
    }
  });

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      customerType: 'INDIVIDUAL',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: JSON.stringify({
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210'
      }),
      status: 'ACTIVE'
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      customerType: 'BUSINESS',
      businessName: 'Acme Corporation',
      email: 'info@acmecorp.com',
      phone: '(555) 987-6543',
      address: JSON.stringify({
        street: '456 Business Blvd',
        city: 'Commercial City',
        state: 'NY',
        zipCode: '10001'
      }),
      status: 'ACTIVE'
    }
  });

  console.log('Seed data created successfully');
  console.log({ admin, agent, customer1, customer2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });