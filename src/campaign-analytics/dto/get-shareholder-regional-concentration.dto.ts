import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetShareholderRegionalConcentrationDto {
  @ApiProperty({ 
    description: 'The unique identifier of the campaign (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  campaignId?: string;

  @ApiProperty({
    description: 'Number of days to filter records (defaults to 30)',
    example: 30,
    required: false,
    default: 30
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsNumber()
  @Min(1)
  days?: number = 30;

  @ApiProperty({ 
    description: 'Filter by specific region (optional)',
    required: false,
    example: 'North America' 
  })
  @IsOptional()
  @IsString()
  region?: string;
} 