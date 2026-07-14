import { PrismaClient, Role, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@1234!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@childsafety.org' },
    update: {},
    create: {
      email: 'admin@childsafety.org',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      provider: AuthProvider.LOCAL,
      isActive: true,
      isEmailVerified: true,
      passwordChangedAt: new Date(),
    },
  });

  // ── Orphanage ────────────────────────────────────────────
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

  // ── Parent ───────────────────────────────────────────────
  const parentPassword = await bcrypt.hash('Parent@1234!', 12);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@childsafety.org' },
    update: {},
    create: {
      email: 'parent@childsafety.org',
      password: parentPassword,
      firstName: 'Test',
      lastName: 'Parent',
      role: Role.PARENT,
      provider: AuthProvider.LOCAL,
      isActive: true,
      isEmailVerified: true,
      passwordChangedAt: new Date(),
    },
  });

  console.log('✅ Seed complete — test accounts created:');
  console.log(`  🛡️  Admin     → ${admin.email}      / Admin@1234!`);
  console.log(`  🏠 Orphanage → ${orphanage.email}  / Orphanage@1234!`);
  console.log(`  👤 Parent    → ${parent.email}     / Parent@1234!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

