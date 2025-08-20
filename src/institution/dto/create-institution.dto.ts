import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'Rumah Sakit Harapan Bunda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Jl. Sehat No. 123, Jakarta' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '021-555-1234' })
  @IsString()
  @IsOptional()
  phone?: string;
}