import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../common/enums/role.enum';
import { Prisma } from '@prisma/client';
import {
  CreateParentDto,
  UpdateParentDto,
  QueryParentDto,
  UpdateVerificationStatusDto,
} from '../dto';
import {
  ParentBasicDto,
  ParentProfileDto,
  PaginatedParentsResponseDto,
  ParentDashboardDto,
  KYCStatusDto,
  VerificationQueueResponseDto,
} from '../dto/parent-response.dto';

@Injectable()
export class ParentsService {
  private readonly logger = new Logger(ParentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateParentDto): Promise<{ id: string }> {
    const existingParent = await this.prisma.parent.findUnique({
      where: { userId },
    });

    if (existingParent) {
      throw new BadRequestException('Parent profile already exists for this user');
    }

    const parent = await this.prisma.parent.create({
      data: {
        userId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender as any,
        nationality: dto.nationality,
        religion: dto.religion,
        maritalStatus: dto.maritalStatus,
        spouseName: dto.spouseName,
        spouseDateOfBirth: dto.spouseDateOfBirth ? new Date(dto.spouseDateOfBirth) : undefined,
        spouseOccupation: dto.spouseOccupation,
        alternatePhone: dto.alternatePhone,
        emergencyContact: dto.emergencyContact,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactRelation: dto.emergencyContactRelation,
        occupation: dto.occupation,
        employmentType: dto.employmentType,
        employerName: dto.employerName,
        employerAddress: dto.employerAddress,
        workPhone: dto.workPhone,
        yearsOfExperience: dto.yearsOfExperience,
        annualIncome: dto.annualIncome,
        incomeRange: dto.incomeRange,
        houseOwnership: dto.houseOwnership,
        numberOfRooms: dto.numberOfRooms,
        hasChildRoom: dto.hasChildRoom,
        hasChronicIllness: dto.hasChronicIllness,
        chronicIllnessDetails: dto.chronicIllnessDetails,
        hasDisability: dto.hasDisability,
        disabilityDetails: dto.disabilityDetails,
        hasHealthInsurance: dto.hasHealthInsurance,
        preferredChildAge: dto.preferredChildAge,
        preferredGender: dto.preferredGender as any,
        preferredCount: dto.preferredCount,
        openToSpecialNeeds: dto.openToSpecialNeeds,
        specialNeedsDetails: dto.specialNeedsDetails,
        adoptionMotivation: dto.adoptionMotivation,
        hasAdoptedBefore: dto.hasAdoptedBefore,
        previousAdoptionDetails: dto.previousAdoptionDetails,
        trustScore: 0,
        isProfileComplete: this.calculateProfileCompletion(dto) >= 80,
      },
    });

    this.logger.log(`Parent profile created: ${parent.id}`);
    return { id: parent.id };
  }

  async findAll(
    queryDto: QueryParentDto,
    userRole: Role,
    userId?: string,
  ): Promise<PaginatedParentsResponseDto> {
    const {
      page = 1,
      limit = 20,
      search,
      verificationStatus,
      kycApproved,
      isActive,
      minTrustScore,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const where: Prisma.ParentWhereInput = {
      deletedAt: null,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (verificationStatus) {
      where.verificationStatus = verificationStatus as any;
    }

    if (kycApproved !== undefined) {
      where.kycStatus = kycApproved ? 'APPROVED' as any : { not: 'APPROVED' as any };
    }

    if (minTrustScore !== undefined) {
      where.trustScore = { gte: minTrustScore };
    }

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { occupation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [parents, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.parent.count({ where }),
    ]);

    const data: ParentBasicDto[] = parents.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: `${p.user.firstName} ${p.user.lastName}`,
      email: p.user.email,
      phone: p.user.phone || '',
      verificationStatus: p.verificationStatus,
      trustScore: p.trustScore,
      kycStatus: p.kycStatus,
      registeredAt: p.createdAt,
    }));

    const summary = {
      pending: await this.prisma.parent.count({ where: { ...where, verificationStatus: 'PENDING' as any } }),
      verified: await this.prisma.parent.count({ where: { ...where, verificationStatus: 'APPROVED' as any } }),
      rejected: await this.prisma.parent.count({ where: { ...where, verificationStatus: 'REJECTED' as any } }),
      highRisk: await this.prisma.parent.count({ where: { ...where, trustScore: { lt: 60 } } }),
    };

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary,
    };
  }

  async findOne(id: string, userId: string, userRole: Role): Promise<ParentProfileDto> {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        addresses: true,
        documents: {
          select: {
            id: true,
            documentType: true,
            status: true,
            fileName: true,
            storageUrl: true,
            createdAt: true,
          },
        },
        familyMembers: true,
        policeVerification: true,
      },
    });

    if (!parent || parent.deletedAt) {
      throw new NotFoundException('Parent not found');
    }

    if (userRole === Role.PARENT && parent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: parent.id,
      userId: parent.userId,
      firstName: parent.user.firstName,
      lastName: parent.user.lastName,
      email: parent.user.email,
      phone: parent.user.phone || '',
      dateOfBirth: parent.dateOfBirth ?? undefined,
      gender: parent.gender ?? undefined,
      nationality: parent.nationality,
      maritalStatus: parent.maritalStatus ?? undefined,
      occupation: parent.occupation ?? undefined,
      annualIncome: parent.annualIncome ?? undefined,
      houseOwnership: parent.houseOwnership ?? undefined,
      verificationStatus: parent.verificationStatus,
      trustScore: parent.trustScore,
      kycStatus: parent.kycStatus,
      verificationNotes: parent.verificationNotes ?? undefined,
      addresses: parent.addresses,
      documents: parent.documents,
      familyMembers: parent.familyMembers,
      policeVerification: parent.policeVerification,
      isActive: parent.isActive,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
    };
  }

  async update(id: string, dto: UpdateParentDto, userId: string, userRole: Role): Promise<void> {
    const parent = await this.prisma.parent.findUnique({ where: { id } });

    if (!parent || parent.deletedAt) {
      throw new NotFoundException('Parent not found');
    }

    if (userRole === Role.PARENT && parent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.parent.update({
      where: { id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender as any,
        nationality: dto.nationality,
        religion: dto.religion,
        maritalStatus: dto.maritalStatus,
        spouseName: dto.spouseName,
        occupation: dto.occupation,
        employmentType: dto.employmentType,
        annualIncome: dto.annualIncome,
        incomeRange: dto.incomeRange,
        houseOwnership: dto.houseOwnership,
        numberOfRooms: dto.numberOfRooms,
        hasChildRoom: dto.hasChildRoom,
        adoptionMotivation: dto.adoptionMotivation,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Parent updated: ${id}`);
  }

  async remove(id: string): Promise<void> {
    const parent = await this.prisma.parent.findUnique({ where: { id } });

    if (!parent || parent.deletedAt) {
      throw new NotFoundException('Parent not found');
    }

    await this.prisma.parent.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    this.logger.log(`Parent soft deleted: ${id}`);
  }

  async updateVerificationStatus(
    id: string,
    dto: UpdateVerificationStatusDto,
    adminId: string,
  ): Promise<void> {
    const parent = await this.prisma.parent.findUnique({ where: { id } });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    await this.prisma.parent.update({
      where: { id },
      data: {
        verificationStatus: dto.status as any,
        verificationNotes: dto.verificationNotes,
        rejectionReason: dto.rejectionReason,
        interviewDate: dto.interviewDate ? new Date(dto.interviewDate) : undefined,
        interviewNotes: dto.interviewNotes,
        verifiedById: dto.status === 'APPROVED' ? adminId : undefined,
        verifiedAt: dto.status === 'APPROVED' ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Parent verification status updated: ${id} -> ${dto.status}`);
  }

  async getDashboard(userId: string): Promise<ParentDashboardDto> {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        adoptionRecords: {
          include: {
            child: {
              select: {
                id: true,
                childCode: true,
                firstName: true,
                lastName: true,
                approximateAge: true,
                dateOfBirth: true,
                healthStatus: true,
                orphanage: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent profile not found');
    }

    const adoptionRecord = parent.adoptionRecords[0];
    const child = adoptionRecord?.child;
    const completedVisits = await this.prisma.visitRequest.count({
      where: { parentId: parent.id, status: 'COMPLETED' },
    });

    let linkedChild: any = undefined;
    if (child) {
      const age = child.dateOfBirth
        ? Math.floor((Date.now() - child.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : child.approximateAge || 0;

      linkedChild = {
        id: child.id,
        childCode: child.childCode,
        name: `${child.firstName} ${child.lastName || ''}`.trim(),
        age,
        orphanageName: child.orphanage?.name || 'Unknown',
        healthStatus: child.healthStatus,
      };
    }

    const adoptionJourney = {
      currentStep: this.calculateAdoptionStep(parent),
      totalSteps: 5,
      steps: [
        { name: 'KYC Submitted', completed: parent.kycStatus !== 'PENDING' },
        { name: 'Identity Verified', completed: parent.verificationStatus === 'APPROVED' },
        { name: 'Visit Completed', completed: completedVisits > 0, isCurrent: completedVisits === 0 && parent.verificationStatus === 'APPROVED' },
        { name: 'Legal Review', completed: adoptionRecord?.status === 'COMPLETED', isCurrent: ['LEGAL_PROCESS', 'UNDER_REVIEW', 'MATCHED'].includes(adoptionRecord?.status || '') },
        { name: 'Adoption Complete', completed: adoptionRecord?.status === 'COMPLETED' },
      ],
    };

    return {
      parent: {
        id: parent.id,
        firstName: parent.user.firstName,
        lastName: parent.user.lastName,
        email: parent.user.email,
      },
      verification: {
        kycStatus: parent.kycStatus,
        trustScore: parent.trustScore,
        verificationStatus: parent.verificationStatus,
      },
      linkedChild,
      adoptionJourney,
    };
  }

  async getKycStatus(userId: string): Promise<KYCStatusDto> {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        documents: {
          select: {
            id: true,
            documentType: true,
            status: true,
            fileName: true,
            storageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent profile not found');
    }

    const complianceStatus =
      parent.kycStatus === 'APPROVED' ? 'Compliant' : 'Partially Compliant';

    return {
      kycStatus: parent.kycStatus,
      lastKycDate: parent.kycSubmittedAt ?? undefined,
      nextKycDue: parent.kycApprovedAt
        ? new Date(parent.kycApprovedAt.getTime() + 180 * 24 * 60 * 60 * 1000)
        : undefined,
      complianceStatus,
      verificationHistory: [],
      documents: parent.documents,
    };
  }

  async getVerificationQueue(queryDto: QueryParentDto): Promise<VerificationQueueResponseDto> {
    const {
      page = 1,
      limit = 20,
      search,
      verificationStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const where: Prisma.ParentWhereInput = {
      deletedAt: null,
      verificationStatus: verificationStatus as any || { in: ['PENDING', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED'] as any[] },
    };

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [parents, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.parent.count({ where }),
    ]);

    const data = parents.map((p) => ({
      id: p.id,
      name: `${p.user.firstName} ${p.user.lastName}`,
      email: p.user.email,
      phone: p.user.phone || '',
      registeredAt: p.createdAt,
      verificationStatus: p.verificationStatus,
      kycStatus: p.kycStatus,
      trustScore: p.trustScore,
      occupation: p.occupation ?? undefined,
      annualIncome: p.annualIncome ?? undefined,
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      pending: await this.prisma.parent.count({ where: { verificationStatus: 'PENDING' as any, deletedAt: null } }),
      verified: await this.prisma.parent.count({ where: { verificationStatus: 'APPROVED' as any, deletedAt: null } }),
      rejected: await this.prisma.parent.count({ where: { verificationStatus: 'REJECTED' as any, deletedAt: null } }),
      highRisk: await this.prisma.parent.count({ where: { trustScore: { lt: 60 }, deletedAt: null } }),
      openIssues: 0,
      today: await this.prisma.parent.count({ where: { createdAt: { gte: today }, deletedAt: null } }),
    };

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async approveParent(id: string, adminId: string): Promise<void> {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    if (parent.verificationStatus === 'APPROVED') {
      throw new BadRequestException('Parent already approved');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.parent.update({
        where: { id },
        data: {
          verificationStatus: 'APPROVED' as any,
          verifiedById: adminId,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (parent.user.role !== Role.PARENT) {
        await tx.user.update({
          where: { id: parent.userId },
          data: { role: Role.PARENT },
        });
      }
    });

    this.logger.log(`Parent approved: ${id}`);
  }

  async rejectParent(id: string, reason: string, adminId: string): Promise<void> {
    const parent = await this.prisma.parent.findUnique({ where: { id } });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    await this.prisma.parent.update({
      where: { id },
      data: {
        verificationStatus: 'REJECTED' as any,
        rejectionReason: reason,
        verifiedById: adminId,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Parent rejected: ${id}`);
  }

  private calculateProfileCompletion(dto: CreateParentDto): number {
    const requiredFields = [
      'dateOfBirth',
      'gender',
      'nationality',
      'occupation',
      'annualIncome',
      'houseOwnership',
      'numberOfRooms',
      'adoptionMotivation',
    ];

    const filledFields = requiredFields.filter((field) => {
      const key = field as keyof CreateParentDto;
      return dto[key] != null;
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }

  private calculateAdoptionStep(parent: any): number {
    if (parent.adoptionRecords?.[0]?.status === 'COMPLETED') return 5;
    if (parent.verificationStatus === 'APPROVED') return 2;
    if (parent.kycStatus !== 'PENDING') return 1;
    return 0;
  }
}
