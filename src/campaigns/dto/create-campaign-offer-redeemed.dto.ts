import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignOfferRedeemedDto {
  @ApiProperty({
    description: 'The ID of the shareholder',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  shareHolderId: string;

  @ApiProperty({
    description: 'The ID of the campaign',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  campaignId: string;
} 