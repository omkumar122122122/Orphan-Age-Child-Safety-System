import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export enum VisitTypeDto {
  INITIAL_ASSESSMENT = 'INITIAL_ASSESSMENT',
  REGULAR_VISIT = 'REGULAR_VISIT',
  PRE_ADOPTION_VISIT = 'PRE_ADOPTION_VISIT',
  POST_ADOPTION_VISIT = 'POST_ADOPTION_VISIT',
  WELFARE_CHECK = 'WELFARE_CHECK',
  SUPERVISED = 'SUPERVISED',
}

export class CreateVisitRequestDto {
  @ApiPropertyOptional({ description: 'Child ID to visit (optional for general visits)' })
  @IsOptional()
  @IsString()
  childId?: string;

  @ApiProperty({ description: 'Orphanage ID where visit will take place' })
  @IsString()
  orphanageId: string;

  @ApiPropertyOptional({ enum: VisitTypeDto, default: VisitTypeDto.REGULAR_VISIT })
  @IsOptional()
  @IsEnum(VisitTypeDto)
  visitType?: VisitTypeDto;

  @ApiProperty({ description: 'Requested visit date (ISO date string)', example: '2026-07-20' })
  @IsDateString()
  requestedDate: string;

  @ApiPropertyOptional({ description: 'Requested time (HH:mm)', example: '10:30' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  requestedTime?: string;

  @ApiPropertyOptional({ description: 'Purpose of visit', example: 'Adoption Inquiry' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  purpose?: string;

  @ApiPropertyOptional({ description: 'Additional notes / reason' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Expected number of visitors', default: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  visitorsCount?: number;

  @ApiPropertyOptional({ description: 'Preferred duration in minutes', default: 60 })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  duration?: number;
}
