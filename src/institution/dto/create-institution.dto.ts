import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsEnum, MaxLength, MinLength } from 'class-validator';

export enum InstitutionType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  PUSKESMAS = 'PUSKESMAS',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY'
}

export enum InstitutionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class CreateInstitutionDto {
  @ApiProperty({ 
    example: 'Rumah Sakit Harapan Bunda',
    description: 'Name of the healthcare institution',
    minLength: 2,
    maxLength: 200
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ 
    example: 'RSU001',
    description: 'Unique institution code',
    minLength: 3,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  code: string;

  @ApiProperty({ 
    example: 'Jl. Sehat No. 123, Jakarta Selatan, DKI Jakarta 12345',
    description: 'Full address of the institution',
    required: false,
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @ApiProperty({ 
    example: '021-555-1234',
    description: 'Phone number of the institution',
    required: false,
    maxLength: 20
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ 
    example: 'admin@rshb.co.id',
    description: 'Email address of the institution',
    required: false,
    format: 'email'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    enum: InstitutionType,
    example: InstitutionType.HOSPITAL,
    description: 'Type of healthcare institution'
  })
  @IsEnum(InstitutionType)
  @IsNotEmpty()
  type: InstitutionType;

  @ApiProperty({ 
    enum: InstitutionStatus,
    example: InstitutionStatus.ACTIVE,
    description: 'Status of the institution',
    default: InstitutionStatus.ACTIVE
  })
  @IsEnum(InstitutionStatus)
  @IsOptional()
  status?: InstitutionStatus = InstitutionStatus.ACTIVE;
}