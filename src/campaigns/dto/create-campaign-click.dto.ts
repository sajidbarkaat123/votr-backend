import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignClickDto {
  @ApiProperty({
    description: 'The ID of the campaign analytics',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  campaignAnalyticsId: string;

  @ApiProperty({
    description: 'Number of clicks',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  clicks: number;
} 