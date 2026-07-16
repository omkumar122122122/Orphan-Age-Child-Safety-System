import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsNumber,
} from 'class-validator';

/**
 * Parent Registration DTO
 * Used when a parent registers through the login page
 */
export class RegisterParentDto {
  @ApiProperty({ example: 'John', description: 'Parent first name' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Parent last name' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Parent email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+919876543210', description: 'Parent phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'Password' })
  @IsString()
  password!: string;

  @ApiProperty({ example: 'Father', description: 'Relationship type' })
  @IsString()
  relationship!: string;

  @ApiPropertyOptional({ example: '1985-05-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'INDIAN', description: 'Nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Engineer', description: 'Occupation' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 75000, description: 'Annual income in INR' })
  @IsOptional()
  @IsNumber()
  annualIncome?: number;

  @ApiPropertyOptional({ example: 'OWNED', description: 'House ownership status', enum: ['OWNED', 'RENTED', 'LEASED', 'FAMILY_OWNED'] })
  @IsOptional()
  @IsEnum(['OWNED', 'RENTED', 'LEASED', 'FAMILY_OWNED'])
  houseOwnership?: string;

  @ApiPropertyOptional({ example: 3, description: 'Number of rooms in house' })
  @IsOptional()
  @IsNumber()
  numberOfRooms?: number;

  @ApiPropertyOptional({ example: 'We want to provide a loving home to a child in need.', description: 'Adoption motivation' })
  @IsOptional()
  @IsString()
  adoptionMotivation?: string;
}