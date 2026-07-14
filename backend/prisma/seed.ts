import { PrismaClient, Role, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('Admin@1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@childsafety.org' },
    update: {},
    create: {
      email: 'admin@childsafety.org',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      provider: AuthProvider.LOCAL,
      isActive: true,
      isEmailVerified: true,
      passwordChangedAt: new Date(),
    },
  });

  // Create default orphanage user
  const orphanagePassword = await bcrypt.hash('Orphanage@1234!', 12);
  const orphanage = await prisma.user.upsert({
    where: { email: 'orphanage@childsafety.org' },
    update: {},
    create: {
      email: 'orphanage@childsafety.org',
      password: orphanagePassword,
      firstName: 'Orphanage',
      lastName: 'Manager',
      role: Role.ORPHANAGE,
      provider: AuthProvider.LOCAL,
      isActive: true,
      isEmailVerified: true,
      passwordChangedAt: new Date(),
    },
  });

  console.log('✅ Seed complete');
  console.log(`  Admin: ${admin.email}`);
  console.log(`  Orphanage: ${orphanage.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
