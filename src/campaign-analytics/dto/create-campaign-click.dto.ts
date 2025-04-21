import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignClickDto {
  @ApiProperty({ description: 'The ID of the campaign' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'The ID of the user who clicked' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The type of click (e.g., "banner", "email", "social")' })
  @IsString()
  clickType: string;

  @ApiProperty({ description: 'The URL or element that was clicked' })
  @IsString()
  clickTarget: string;

  @ApiProperty({ description: 'The timestamp of the click', required: false })
  @IsOptional()
  @IsDate()
  clickedAt?: Date;
} 