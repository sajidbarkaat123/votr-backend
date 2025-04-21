import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Note: This DTO doesn't extend the base DTO because it doesn't need the days property
export class GetCampaignShareholdersDto {
  @ApiProperty({
    description: 'The unique identifier of the campaign',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsUUID()
  campaignId: string;
} 