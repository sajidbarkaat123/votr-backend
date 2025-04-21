import { IsString, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CampaignAnalyticsBaseDto {
  @ApiProperty({
    description: 'The unique identifier of the campaign',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsUUID()
  campaignId: string;

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
} 