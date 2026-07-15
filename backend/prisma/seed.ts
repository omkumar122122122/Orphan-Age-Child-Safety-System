import { PrismaClient, Role, Gender, MaritalStatus, EmploymentType, HouseOwnership, ParentVerificationStatus, KycStatus, ChildGender, ChildStatus, HealthStatus, BloodGroup, AdoptionStatus, OrganizationType, OrphanageStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Common password for all test users
  const password = await bcrypt.hash('test123', 12);

  // ═══════════════════════════════════════════════════════
  // 1. CREATE ADMIN USER
  // ═══════════════════════════════════════════════════════
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      phone: '+919876543210',
      isEmailVerified: true,
      isActive: true,
      passwordChangedAt: new Date(),
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ═══════════════════════════════════════════════════════
  // 2. CREATE ORPHANAGE & ORPHANAGE USER
  // ═══════════════════════════════════════════════════════
  const orphanage = await prisma.orphanage.upsert({
    where: { code: 'ORP-DL-2024-001' },
    update: {},
    create: {
      code: 'ORP-DL-2024-001',
      name: 'Sunshine Children Home',
      organizationType: OrganizationType.NGO,
      status: OrphanageStatus.ACTIVE,
      registrationNumber: 'NGO/DL/2010/12345',
      governmentLicenseNumber: 'GOV/DL/2010/54321',
      establishmentDate: new Date('2010-01-15'),
      officialEmail: 'contact@sunshineorphanage.org',
      phone: '+919876543211',
      website: 'https://sunshineorphanage.org',
      addressLine1: 'Block A, Sector 15',
      city: 'New Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India',
      totalCapacity: 50,
      currentOccupancy: 12,
      faceRecognitionEnabled: true,
      cctvInstalled: true,
      numberOfCameras: 8,
      biometricAttendanceEnabled: true,
      complianceScore: 92,
      isActive: true,
  // Create Parent profile record (required for /parents/dashboard)
  await prisma.parent.upsert({
    where: { userId: parent.id },
    update: {},
    create: {
      userId: parent.id,
      nationality: 'Indian',
      trustScore: 0,
      isProfileComplete: false,
    },
  });

  // ── Orphanage Records ────────────────────────────────────
  console.log('🏠 Seeding orphanages...');

  const orphanage1 = await prisma.orphanage.upsert({
    where: { registrationNumber: 'REG-DL-2026-001' },
    update: {},
    create: {
      code: 'ORP-DL-2026-001',
      name: 'Sunrise Care Home',
      organizationType: 'NGO',
      registrationNumber: 'REG-DL-2026-001',
      governmentLicenseNumber: 'GOV-CW-DEL-001',
      establishmentDate: new Date('2012-06-18'),
      officialEmail: 'office@sunrisecare.org',
      phone: '+919876540001',
      alternativePhone: '+919876540002',
      website: 'https://sunrisecare.org',
      addressLine1: '21 Welfare Road, Saket',
      city: 'Delhi',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110017',
      country: 'India',
      totalCapacity: 180,
      currentOccupancy: 164,
      faceRecognitionEnabled: true,
      cctvInstalled: true,
      numberOfCameras: 38,
      gpsTrackingAvailable: true,
      emergencyAlertEnabled: true,
      biometricAttendanceEnabled: true,
      bankName: 'State Bank of India',
      bankAccountNumber: '123456789012',
      bankIfscCode: 'SBIN0001482',
      bankAccountHolder: 'Sunrise Care Home',
      gstNumber: '07SUNRISE1234Z1Z',
      panNumber: 'AAACT1234C',
      complianceScore: 94,
      isActive: true,
      isVerified: true,
    },
  });

  const orphanage2 = await prisma.orphanage.upsert({
    where: { registrationNumber: 'REG-MH-2026-002' },
    update: {},
    create: {
      code: 'ORP-MH-2026-002',
      name: 'Hope Foundation Mumbai',
      organizationType: 'TRUST',
      registrationNumber: 'REG-MH-2026-002',
      governmentLicenseNumber: 'GOV-CW-MUM-002',
      establishmentDate: new Date('2010-03-15'),
      officialEmail: 'contact@hopefoundation.org',
      phone: '+912233445566',
      alternativePhone: '+912233445567',
      website: 'https://hopefoundation.org',
      addressLine1: '45 Marine Drive, Nariman Point',
      city: 'Mumbai',
      district: 'Mumbai City',
      state: 'Maharashtra',
      pincode: '400021',
      country: 'India',
      totalCapacity: 200,
      currentOccupancy: 185,
      faceRecognitionEnabled: true,
      cctvInstalled: true,
      numberOfCameras: 45,
      gpsTrackingAvailable: true,
      emergencyAlertEnabled: true,
      biometricAttendanceEnabled: true,
      bankName: 'HDFC Bank',
      bankAccountNumber: '987654321098',
      bankIfscCode: 'HDFC0001234',
      bankAccountHolder: 'Hope Foundation Trust',
      gstNumber: '27HOPEF1234Z1Z',
      panNumber: 'AAAHF1234T',
      complianceScore: 96,
      isActive: true,
      isVerified: true,
    },
  });

  const orphanage3 = await prisma.orphanage.upsert({
    where: { registrationNumber: 'REG-KA-2026-003' },
    update: {},
    create: {
      code: 'ORP-KA-2026-003',
      name: 'Little Angels Bangalore',
      organizationType: 'NGO',
      registrationNumber: 'REG-KA-2026-003',
      governmentLicenseNumber: 'GOV-CW-BLR-003',
      establishmentDate: new Date('2015-08-20'),
      officialEmail: 'info@littleangels.org',
      phone: '+918012345678',
      alternativePhone: '+918012345679',
      website: 'https://littleangels.org',
      addressLine1: '123 MG Road, Koramangala',
      city: 'Bangalore',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      pincode: '560034',
      country: 'India',
      totalCapacity: 150,
      currentOccupancy: 120,
      faceRecognitionEnabled: true,
      cctvInstalled: true,
      numberOfCameras: 30,
      gpsTrackingAvailable: false,
      emergencyAlertEnabled: true,
      biometricAttendanceEnabled: false,
      bankName: 'ICICI Bank',
      bankAccountNumber: '112233445566',
      bankIfscCode: 'ICIC0001234',
      bankAccountHolder: 'Little Angels NGO',
      gstNumber: '29ANGEL1234Z1Z',
      panNumber: 'AAALA1234N',
      complianceScore: 78,
      isActive: true,
      isVerified: true,
    },
  });

  // Link orphanage user to first orphanage
  await prisma.orphanageStaff.upsert({
    where: {
      orphanageId_userId: {
        orphanageId: orphanage1.id,
        userId: orphanage.id,
      },
    },
    update: {},
    create: {
      orphanageId: orphanage1.id,
      userId: orphanage.id,
      role: 'ADMINISTRATOR',
      designation: 'Home Administrator',
      isActive: true,
      joinDate: new Date('2012-06-18'),
    },
  });

  // Create licenses for orphanage 1
  await prisma.orphanageLicense.create({
    data: {
      orphanageId: orphanage1.id,
      licenseType: 'REGISTRATION_CERTIFICATE',
      licenseNumber: 'REG-DL-2026-001',
      issuingAuthority: 'Government of Delhi',
      issueDate: new Date('2012-06-18'),
      status: 'VERIFIED',
      documentUrl: '/uploads/orphanages/licenses/reg-cert-001.pdf',
      storagePath: './uploads/orphanages/licenses/reg-cert-001.pdf',
    },
  });

  await prisma.orphanageLicense.create({
    data: {
      orphanageId: orphanage1.id,
      licenseType: 'NGO_CERTIFICATE',
      licenseNumber: 'NGO-DL-2012-001',
      issuingAuthority: 'Ministry of Social Justice',
      issueDate: new Date('2012-07-01'),
      status: 'VERIFIED',
      documentUrl: '/uploads/orphanages/licenses/ngo-cert-001.pdf',
      storagePath: './uploads/orphanages/licenses/ngo-cert-001.pdf',
    },
  });

  console.log('✅ Seed complete — test accounts and orphanages created:');
  console.log(`  🛡️  Admin     → ${admin.email}      / Admin@1234!`);
  console.log(`  🏠 Orphanage → ${orphanage.email}  / Orphanage@1234!`);
  console.log(`  👤 Parent    → ${parent.email}     / Parent@1234!`);
  console.log(`  🏢 Orphanages → ${orphanage1.name}, ${orphanage2.name}, ${orphanage3.name}`);
}     passwordChangedAt: new Date(),
    },
  });
  console.log('✅ Orphanage user created:', orphanageUser.email);

  // Link user to orphanage
  await prisma.orphanageStaff.upsert({
    where: {
      orphanageId_userId: {
        orphanageId: orphanage.id,
        userId: orphanageUser.id,
      },
    },
    update: {},
    create: {
      orphanageId: orphanage.id,
      userId: orphanageUser.id,
      role: 'ADMINISTRATOR',
      designation: 'Director',
      employeeId: 'EMP-001',
      joiningDate: new Date('2015-01-01'),
      isActive: true,
    },
  });
  console.log('✅ Orphanage staff linked\n');

  // ═══════════════════════════════════════════════════════
  // 3. CREATE PARENT USER & PROFILE (APPROVED)
  // ═══════════════════════════════════════════════════════
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@test.com' },
    update: {},
    create: {
      email: 'parent@test.com',
      password,
      firstName: 'Priya',
      lastName: 'Mehta',
      role: Role.PARENT,
      phone: '+919876543213',
      isEmailVerified: true,
      isActive: true,
      passwordChangedAt: new Date(),
    },
  });
  console.log('✅ Parent user created:', parentUser.email);

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      dateOfBirth: new Date('1988-06-15'),
      gender: Gender.FEMALE,
      nationality: 'Indian',
      religion: 'Hindu',
      maritalStatus: MaritalStatus.MARRIED,
      spouseName: 'Amit Mehta',
      spouseDateOfBirth: new Date('1986-03-20'),
      spouseOccupation: 'Software Engineer',
      alternatePhone: '+919876543214',
      emergencyContact: '+919876543215',
      emergencyContactName: 'Rakesh Mehta',
      emergencyContactRelation: 'Brother',
      occupation: 'Teacher',
      employmentType: EmploymentType.EMPLOYED_FULL_TIME,
      employerName: 'Delhi Public School',
      employerAddress: 'Mathura Road, New Delhi',
      yearsOfExperience: 10,
      annualIncome: 900000,
      incomeVerified: true,
      houseOwnership: HouseOwnership.OWNED,
      numberOfRooms: 4,
      hasChild
