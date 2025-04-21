import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignOfferRedeemedDto {
  @ApiProperty({ description: 'The ID of the campaign' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'The ID of the user who redeemed the offer' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The type of offer redeemed' })
  @IsString()
  offerType: string;

  @ApiProperty({ description: 'The value of the offer redeemed', required: false })
  @IsOptional()
  @IsNumber()
  offerValue?: number;

  @ApiProperty({ description: 'The timestamp when the offer was redeemed', required: false })
  @IsOptional()
  @IsDate()
  redeemedAt?: Date;

  @ApiProperty({ description: 'Additional metadata about the redemption', required: false })
  @IsOptional()
  @IsString()
  metadata?: string;
} 