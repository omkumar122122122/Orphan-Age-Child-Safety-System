import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadService } from './services/file-upload.service';
import { ComplianceCalculatorService } from './services/compliance-calculator.service';
import { CreateOrphanageDto } from './dto/create-orphanage.dto';
import { UpdateOrphanageDto } from './dto/update-orphanage.dto';
import { OrphanageQueryDto } from './dto/orphanage-query.dto';
import { Prisma, OrphanageStaffRole, ChildGender, OrganizationType } from '@prisma/client';

@Injectable()
export class OrphanagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly complianceCalculator: ComplianceCalculatorService,
  ) {}

  async create(dto: CreateOrphanageDto, files: any, userId: string) {
    // Check for duplicate registration number
    const existingByRegNum = await this.prisma.orphanage.findUnique({
      where: { registrationNumber: dto.registrationNumber },
    });
    if (existingByRegNum) {
      throw new ConflictException('Registration number already exists');
    }

    // Check for duplicate email
    const existingByEmail = await this.prisma.orphanage.findUnique({
      where: { officialEmail: dto.officialEmail },
    });
    if (existingByEmail) {
      throw new ConflictException('Official email already exists');
    }

    // Check for duplicate government license if provided
    if (dto.governmentLicenseNumber) {
      const existingByLicense = await this.prisma.orphanage.findFirst({
        where: { governmentLicenseNumber: dto.governmentLicenseNumber },
      });
      if (existingByLicense) {
        throw new ConflictException('Government license number already exists');
      }
    }

    // Validate capacity
    if (dto.numberOfChildren && dto.capacity) {
      if (dto.numberOfChildren > dto.capacity) {
        throw new BadRequestException(
          'Number of children cannot exceed capacity',
        );
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // Generate unique code
      const code = await this.generateOrphanageCode(dto.city, dto.state);

      // Create orphanage
      const orphanage = await tx.orphanage.create({
        data: {
          code,
          name: dto.name,
          organizationType: dto.organizationType as OrganizationType,
          registrationNumber: dto.registrationNumber,
          governmentLicenseNumber: dto.governmentLicenseNumber,
          establishmentDate: dto.establishmentDate
            ? new Date(dto.establishmentDate)
            : null,
          officialEmail: dto.officialEmail,
          phone: dto.phone,
          alternativePhone: dto.alternativeContact,
          website: dto.website,
          addressLine1: dto.fullAddress || dto.city,
          addressLine2: null,
          landmark: null,
          city: dto.city,
          district: dto.district,
          state: dto.state,
          pincode: dto.pinCode,
          country: dto.country || 'India',
          totalCapacity: dto.capacity || 0,
          currentOccupancy: dto.numberOfChildren || 0,
          faceRecognitionEnabled: dto.faceRecognitionEnabled === 'Yes',
          cctvInstalled: dto.cctvInstalled === 'Yes',
          numberOfCameras: dto.numberOfCameras || 0,
          gpsTrackingAvailable: dto.gpsTrackingAvailable === 'Yes',
          emergencyAlertEnabled: dto.emergencyAlertSystemEnabled === 'Yes',
          biometricAttendanceEnabled:
            dto.childAttendanceSystem?.includes('Biometric') || false,
          bankName: dto.bankName,
          bankAccountNumber: dto.accountNumber,
          bankIfscCode: dto.ifscCode,
          bankAccountHolder: dto.accountHolderName,
          gstNumber: dto.gstNumber,
          panNumber: dto.panCard,
          complianceScore: 0,
          isActive: true,
          isVerified: false,
        },
      });

      // Upload files if provided
      if (files && Object.keys(files).length > 0) {
        const licenseTypes: Record<string, string> = {
          registrationCertificate: 'REGISTRATION_CERTIFICATE',
          ngoCertificate: 'NGO_CERTIFICATE',
          governmentLicense: 'GOVERNMENT_LICENSE',
        };

        for (const [fieldName, licenseType] of Object.entries(licenseTypes)) {
          if (files[fieldName] && files[fieldName][0]) {
            const file = files[fieldName][0];
            const uploadResult = await this.fileUploadService.uploadFile(
              file,
              `orphanages/${orphanage.id}/licenses`,
            );

            await tx.orphanageLicense.create({
              data: {
                orphanageId: orphanage.id,
                licenseType: licenseType as any,
                licenseNumber: dto.registrationNumber,
                issuingAuthority: 'Government Authority',
                status: 'PENDING',
                documentUrl: uploadResult.url,
                storagePath: uploadResult.path,
              },
            });
          }
        }
      }

      // Link administrator if userId provided
      if (userId) {
        await tx.orphanageStaff.create({
          data: {
            orphanageId: orphanage.id,
            userId,
            role: OrphanageStaffRole.ADMINISTRATOR,
            designation: dto.designation || 'Administrator',
            isActive: true,
          },
        });
      }

      // Calculate and update compliance score
      const licenses = await tx.orphanageLicense.findMany({
        where: { orphanageId: orphanage.id },
      });
      const complianceScore =
        this.complianceCalculator.calculateComplianceScore(
          orphanage,
          licenses,
        );

      await tx.orphanage.update({
        where: { id: orphanage.id },
        data: { complianceScore },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE_ORPHANAGE',
          resource: 'Orphanage',
          resourceId: orphanage.id,
          details: { name: orphanage.name, code: orphanage.code },
          success: true,
        },
      });

      return {
        success: true,
        message: 'Orphanage registered successfully',
        data: {
          id: orphanage.id,
          code: orphanage.code,
          name: orphanage.name,
        },
      };
    });
  }

  async findAll(query: OrphanageQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      organizationType,
      minCompliance,
      maxCompliance,
      city,
      state,
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.OrphanageWhereInput = {
      deletedAt: null,
      isActive,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(organizationType && { organizationType }),
      ...(minCompliance !== undefined && {
        complianceScore: { gte: minCompliance },
      }),
      ...(maxCompliance !== undefined && {
        complianceScore: { lte: maxCompliance },
      }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
    };

    // Execute queries
    const [orphanages, total] = await Promise.all([
      this.prisma.orphanage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          code: true,
          name: true,
          city: true,
          state: true,
          totalCapacity: true,
          currentOccupancy: true,
          complianceScore: true,
          organizationType: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.orphanage.count({ where }),
    ]);

    // Transform response
    const data = orphanages.map((orphanage) => ({
      id: orphanage.id,
      code: orphanage.code,
      name: orphanage.name,
      city: orphanage.city,
      state: orphanage.state,
      capacity: orphanage.totalCapacity,
      occupancy: orphanage.currentOccupancy,
      compliance: orphanage.complianceScore,
      organizationType: orphanage.organizationType,
      isActive: orphanage.isActive,
    }));

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const orphanage = await this.prisma.orphanage.findUnique({
      where: { id, deletedAt: null },
    });

    if (!orphanage) {
      throw new NotFoundException('Orphanage not found');
    }

    return {
      success: true,
      data: {
        id: orphanage.id,
        code: orphanage.code,
        name: orphanage.name,
        registrationNumber: orphanage.registrationNumber,
        governmentLicenseNumber: orphanage.governmentLicenseNumber,
        city: orphanage.city,
        state: orphanage.state,
        capacity: orphanage.totalCapacity,
        occupancy: orphanage.currentOccupancy,
        compliance: orphanage.complianceScore,
        phone: orphanage.phone,
        fullAddress: `${orphanage.addressLine1}, ${orphanage.city}, ${orphanage.state} ${orphanage.pincode}`,
        organizationType: orphanage.organizationType,
      },
    };
  }

  async getProfile(id: string) {
    const orphanage = await this.prisma.orphanage.findUnique({
      where: { id, deletedAt: null },
      include: {
        staff: {
          where: { isActive: true },
          include: { user: true },
        },
        licenses: true,
      },
    });

    if (!orphanage) {
      throw new NotFoundException('Orphanage not found');
    }

    // Aggregate child summary
    const childSummary = await this.aggregateChildSummary(id);

    // Aggregate staff summary
    const staffSummary = await this.aggregateStaffSummary(id);

    // Find administrator
    const admin = orphanage.staff.find(
      (s) => s.role === OrphanageStaffRole.ADMINISTRATOR,
    );

    // Build KYC object
    const kyc = {
      registrationCertificate: orphanage.licenses.find(
        (l) => l.licenseType === 'REGISTRATION_CERTIFICATE',
      )?.documentUrl,
      ngoCertificate: orphanage.licenses.find(
        (l) => l.licenseType === 'NGO_CERTIFICATE',
      )?.documentUrl,
      governmentLicense: orphanage.licenses.find(
        (l) => l.licenseType === 'GOVERNMENT_LICENSE',
      )?.documentUrl,
      administratorIdProof: null,
      panCard: orphanage.panNumber,
      gstNumber: orphanage.gstNumber,
      addressProof: null,
    };

    return {
      success: true,
      data: {
        id: orphanage.id,
        code: orphanage.code,
        name: orphanage.name,
        registrationNumber: orphanage.registrationNumber,
        governmentLicenseNumber: orphanage.governmentLicenseNumber,
        establishmentDate: orphanage.establishmentDate,
        organizationType: orphanage.organizationType,
        numberOfChildren: orphanage.currentOccupancy,
        capacity: orphanage.totalCapacity,
        compliance: orphanage.complianceScore,
        officialEmail: orphanage.officialEmail,
        phone: orphanage.phone,
        alternativeContact: orphanage.alternativePhone,
        website: orphanage.website,
        country: orphanage.country,
        state: orphanage.state,
        district: orphanage.district,
        city: orphanage.city,
        pinCode: orphanage.pincode,
        fullAddress: `${orphanage.addressLine1}, ${orphanage.city}, ${orphanage.state} ${orphanage.pincode}`,
        administrator: admin
          ? {
              name: `${admin.user.firstName} ${admin.user.lastName}`,
              designation: admin.designation,
              mobile: admin.user.phone,
              email: admin.user.email,
              profilePhoto: admin.user.avatar,
            }
          : null,
        kyc,
        childSummary,
        staff: staffSummary,
        facilities: orphanage.staff
          .map((s) => this.mapStaffRoleToFacility(s.role))
          .filter(Boolean),
        emergencyContact: null,
        aiSafety: {
          faceRecognitionEnabled: orphanage.faceRecognitionEnabled
            ? 'Yes'
            : 'No',
          cctvInstalled: orphanage.cctvInstalled ? 'Yes' : 'No',
          numberOfCameras: orphanage.numberOfCameras,
          visitorFaceVerificationEnabled: 'No',
          childAttendanceSystem: orphanage.biometricAttendanceEnabled
            ? 'Biometric and face recognition'
            : 'Manual',
          gpsTrackingAvailable: orphanage.gpsTrackingAvailable ? 'Yes' : 'No',
          emergencyAlertSystemEnabled: orphanage.emergencyAlertEnabled
            ? 'Yes'
            : 'No',
        },
        bankDetails: {
          bankName: orphanage.bankName,
          accountHolderName: orphanage.bankAccountHolder,
          accountNumber: this.maskAccountNumber(orphanage.bankAccountNumber),
          ifscCode: orphanage.bankIfscCode,
        },
      },
    };
  }

  async getStatistics(id: string) {
    const orphanage = await this.prisma.orphanage.findUnique({
      where: { id, deletedAt: null },
    });

    if (!orphanage) {
      throw new NotFoundException('Orphanage not found');
    }

    // Count total admissions
    const totalAdmissions = await this.prisma.child.count({
      where: { orphanageId: id },
    });

    // Count adopted children
    const adoptedChildrenCount = await this.prisma.child.count({
      where: { orphanageId: id, adoptionStatus: 'COMPLETED' },
    });

    // Current children count
    const currentChildrenCount = await this.prisma.child.count({
      where: {
        orphanageId: id,
        currentStatus: 'ACTIVE',
        deletedAt: null,
      },
    });

    // Calculate occupancy percentage
    const occupancyPercentage = orphanage.totalCapacity
      ? Math.round((currentChildrenCount / orphanage.totalCapacity) * 100)
      : 0;

    return {
      success: true,
      data: {
        totalAdmissions,
        adoptedChildrenCount,
        currentChildrenCount,
        occupancyPercentage,
        complianceScore: orphanage.complianceScore,
      },
    };
  }

  async update(id: string, dto: UpdateOrphanageDto, userId: string) {
    const orphanage = await this.prisma.orphanage.findUnique({
      where: { id, deletedAt: null },
    });

    if (!orphanage) {
      throw new NotFoundException('Orphanage not found');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.orphanage.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.phone && { phone: dto.phone }),
          ...(dto.city && { city: dto.city }),
          ...(dto.state && { state: dto.state }),
          ...(dto.capacity && { totalCapacity: dto.capacity }),
          ...(dto.numberOfChildren !== undefined && {
            currentOccupancy: dto.numberOfChildren,
          }),
        },
      });

      // Recalculate compliance
      const licenses = await tx.orphanageLicense.findMany({
        where: { orphanageId: id },
      });
      const complianceScore =
        this.complianceCalculator.calculateComplianceScore(updated, licenses);

      await tx.orphanage.update({
        where: { id },
        data: { complianceScore },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_ORPHANAGE',
          resource: 'Orphanage',
          resourceId: id,
          success: true,
        },
      });

      return {
        success: true,
        message: 'Orphanage updated successfully',
        data: updated,
      };
    });
  }

  async remove(id: string, userId: string) {
    const orphanage = await this.prisma.orphanage.findUnique({
      where: { id, deletedAt: null },
    });

    if (!orphanage) {
      throw new NotFoundException('Orphanage not found');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Soft delete orphanage
      await tx.orphanage.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });

      // Unlink children
      await tx.child.updateMany({
        where: { orphanageId: id },
        data: { orphanageId: null },
      });

      // Deactivate staff
      await tx.orphanageStaff.updateMany({
        where: { orphanageId: id },
        data: { isActive: false, endDate: new Date() },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'DELETE_ORPHANAGE',
          resource: 'Orphanage',
          resourceId: id,
          success: true,
        },
      });

      return {
        success: true,
        message: 'Orphanage deleted successfully',
      };
    });
  }

  // Dashboard methods for ORPHANAGE role
  async getDashboardStats(userId: string) {
    // Find orphanage for this user
    const staffRecord = await this.prisma.orphanageStaff.findFirst({
      where: { userId, isActive: true },
      include: { orphanage: true },
    });

    if (!staffRecord) {
      throw new NotFoundException('No orphanage found for this user');
    }

    const orphanageId = staffRecord.orphanageId;

    // Get children count
    const inCare = await this.prisma.child.count({
      where: {
        orphanageId,
        currentStatus: 'ACTIVE',
        deletedAt: null,
      },
    });

    // Get at-risk children count
    const atRiskChildren = await this.prisma.child.findMany({
      where: {
        orphanageId,
        currentStatus: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        aiRiskScores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
        },
      },
    });

    const atRisk = atRiskChildren.filter(
      (child) =>
        child.aiRiskScores[0] &&
        (child.aiRiskScores[0].riskLevel === 'MEDIUM' ||
          child.aiRiskScores[0].riskLevel === 'HIGH' ||
          child.aiRiskScores[0].riskLevel === 'CRITICAL'),
    ).length;

    // Get system-wide stats
    const registeredChildren = await this.prisma.child.count({
      where: { deletedAt: null },
    });

    const activeOrphanages = await this.prisma.orphanage.count({
      where: { isActive: true, deletedAt: null },
    });

    const criticalAlerts = await this.prisma.alert.count({
      where: {
        orphanageId,
        severity: 'CRITICAL',
        status: 'OPEN',
      },
    });

    return {
      success: true,
      data: {
        inCare,
        atRisk,
        aiStatus: 'Active',
        registeredChildren,
        safeZonesOnline: 42, // Mock data
        activeOrphanages,
        criticalAlerts,
      },
    };
  }

  async getMyChildren(userId: string, limit: number = 5) {
    // Find orphanage for this user
    const staffRecord = await this.prisma.orphanageStaff.findFirst({
      where: { userId, isActive: true },
    });

    if (!staffRecord) {
      throw new NotFoundException('No orphanage found for this user');
    }

    const children = await this.prisma.child.findMany({
      where: {
        orphanageId: staffRecord.orphanageId,
        currentStatus: 'ACTIVE',
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        childCode: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        approximateAge: true,
        healthStatus: true,
        aiRiskScores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
        },
      },
    });

    const total = await this.prisma.child.count({
      where: {
        orphanageId: staffRecord.orphanageId,
        currentStatus: 'ACTIVE',
        deletedAt: null,
      },
    });

    const data = children.map((child) => ({
      id: child.id,
      childCode: child.childCode,
      name: `${child.firstName} ${child.lastName || ''}`.trim(),
      age: this.calculateAge(child.dateOfBirth, child.approximateAge),
      risk: child.aiRiskScores[0]?.riskLevel || 'LOW',
      health: child.healthStatus,
    }));

    return {
      success: true,
      data,
      total,
    };
  }

  async getSafetyChart(userId: string) {
    // Find orphanage for this user
    const staffRecord = await this.prisma.orphanageStaff.findFirst({
      where: { userId, isActive: true },
      include: { orphanage: true },
    });

    if (!staffRecord) {
      throw new NotFoundException('No orphanage found for this user');
    }

    // Mock data for now - in production, aggregate from historical data
    return {
      success: true,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Safety Score',
            data: [82, 85, 87, 89, 91, 94],
          },
          {
            label: 'Compliance',
            data: [78, 81, 84, 86, 88, staffRecord.orphanage.complianceScore],
          },
        ],
      },
    };
  }

  // Helper methods
  private async generateOrphanageCode(
    city: string,
    state: string,
  ): Promise<string> {
    const stateCode = this.getStateCode(state);
    const year = new Date().getFullYear();
    const count = await this.prisma.orphanage.count({
      where: {
        state,
        createdAt: { gte: new Date(year, 0, 1) },
      },
    });
    const seq = String(count + 1).padStart(3, '0');
    return `ORP-${stateCode}-${year}-${seq}`;
  }

  private getStateCode(state: string): string {
    const stateCodes: Record<string, string> = {
      Delhi: 'DL',
      Maharashtra: 'MH',
      Karnataka: 'KA',
      'Tamil Nadu': 'TN',
      'Uttar Pradesh': 'UP',
      Rajasthan: 'RJ',
      Gujarat: 'GJ',
      'West Bengal': 'WB',
      // Add more as needed
    };
    return stateCodes[state] || 'XX';
  }

  private async aggregateChildSummary(orphanageId: string) {
    const children = await this.prisma.child.findMany({
      where: { orphanageId, deletedAt: null },
      select: { gender, dateOfBirth, approximateAge, hasDisability },
    });

    const summary = {
      totalBoys: 0,
      totalGirls: 0,
      below5: 0,
      age5To12: 0,
      above12: 0,
      specialNeeds: 0,
    };

    children.forEach((child) => {
      const age = this.calculateAge(child.dateOfBirth, child.approximateAge);

      if (child.gender === ChildGender.MALE) summary.totalBoys++;
      else if (child.gender === ChildGender.FEMALE) summary.totalGirls++;

      if (age < 5) summary.below5++;
      else if (age <= 12) summary.age5To12++;
      else summary.above12++;

      if (child.hasDisability) summary.specialNeeds++;
    });

    return summary;
  }

  private async aggregateStaffSummary(orphanageId: string) {
    const staff = await this.prisma.orphanageStaff.findMany({
      where: { orphanageId, isActive: true },
    });

    const summary = {
      totalStaff: staff.length,
      caretakers: staff.filter((s) => s.role === OrphanageStaffRole.CARETAKER)
        .length,
      teachers: staff.filter((s) => s.role === OrphanageStaffRole.TEACHER)
        .length,
      medicalStaff: staff.filter(
        (s) => s.role === OrphanageStaffRole.MEDICAL_STAFF,
      ).length,
      securityGuards: staff.filter(
        (s) => s.role === OrphanageStaffRole.SECURITY_GUARD,
      ).length,
      volunteers: staff.filter((s) => s.role === OrphanageStaffRole.VOLUNTEER)
        .length,
    };

    return summary;
  }

  private calculateAge(
    dateOfBirth: Date | null,
    approximateAge: number | null,
  ): number {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }
    return approximateAge || 0;
  }

  private maskAccountNumber(accountNumber: string | null): string | null {
    if (!accountNumber) return null;
    if (accountNumber.length <= 4) return accountNumber;
    return 'XXXXXX' + accountNumber.slice(-4);
  }

  private mapStaffRoleToFacility(role: OrphanageStaffRole): string | null {
    const mapping: Record<string, string> = {
      MEDICAL_STAFF: 'Medical Room',
      SECURITY_GUARD: 'Security Guards',
      TEACHER: 'School',
      CARETAKER: 'Dormitory',
    };
    return mapping[role] || null;
  }
}
