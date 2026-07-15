import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitKycDto {
  @ApiPropertyOptional({
    example: 'All required identity and income documents have been uploaded.',
    description: 'Optional notes submitted with the KYC package',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
