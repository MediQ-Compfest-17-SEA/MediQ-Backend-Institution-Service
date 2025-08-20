import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInstitutionDto {
  @ApiPropertyOptional({ example: 'RS Harapan Sejahtera' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Jl. Kemerdekaan No. 45, Jakarta' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '021-555-5678' })
  @IsString()
  @IsOptional()
  phone?: string;
}