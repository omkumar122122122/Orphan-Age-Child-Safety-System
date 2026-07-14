import { ApiProperty } from '@nestjs/swagger';

export class ParentBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  verificationStatus: string;

  @ApiProperty()
  trustScore: number;

  @ApiProperty()
  kycStatus: string;

  @ApiProperty()
  registeredAt: Date;
}

export class ParentProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ required: false })
  maritalStatus?: string;

  @ApiProperty({ required: false })
  occupation?: string;

  @ApiProperty({ required: false })
  annualIncome?: number;

  @ApiProperty({ required: false })
  houseOwnership?: string;

  @ApiProperty()
  verificationStatus: string;

  @ApiProperty()
  trustScore: number;

  @ApiProperty()
  kycStatus: string;

  @ApiProperty({ required: false })
  verificationNotes?: string;

  @ApiProperty({ type: [Object], required: false })
  addresses?: any[];

  @ApiProperty({ type: [Object], required: false })
  documents?: any[];

  @ApiProperty({ type: [Object], required: false })
  familyMembers?: any[];

  @ApiProperty({ required: false })
  policeVerification?: any;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedParentsResponseDto {
  @ApiProperty({ type: [ParentBasicDto] })
  data: ParentBasicDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;

  @ApiProperty({ required: false })
  summary?: {
    pending: number;
    verified: number;
    rejected: number;
    highRisk: number;
  };
}

export class ParentDashboardDto {
  @ApiProperty()
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty()
  verification: {
    kycStatus: string;
    trustScore: number;
    verificationStatus: string;
  };

  @ApiProperty({ required: false })
  linkedChild?: {
    id: string;
    childCode: string;
    name: string;
    age: number;
    orphanageName: string;
    healthStatus: string;
  };

  @ApiProperty({ required: false })
  adoptionJourney?: {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
      name: string;
      completed: boolean;
      isCurrent?: boolean;
    }>;
  };
}

export class KYCStatusDto {
  @ApiProperty()
  kycStatus: string;

  @ApiProperty({ required: false })
  lastKycDate?: Date;

  @ApiProperty({ required: false })
  nextKycDue?: Date;

  @ApiProperty()
  complianceStatus: string;

  @ApiProperty({ type: [Object] })
  verificationHistory: any[];

  @ApiProperty({ type: [Object] })
  documents: any[];
}

export class VerificationQueueItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  registeredAt: Date;

  @ApiProperty()
  verificationStatus: string;

  @ApiProperty()
  kycStatus: string;

  @ApiProperty()
  trustScore: number;

  @ApiProperty({ required: false })
  occupation?: string;

  @ApiProperty({ required: false })
  annualIncome?: number;
}

export class VerificationQueueResponseDto {
  @ApiProperty({ type: [VerificationQueueItemDto] })
  data: VerificationQueueItemDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;

  @ApiProperty()
  stats: {
    pending: number;
    verified: number;
    rejected: number;
    highRisk: number;
    openIssues: number;
    today: number;
  };
}
