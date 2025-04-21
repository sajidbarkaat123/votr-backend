import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignEmailDto {
  @ApiProperty({
    description: 'Whether the email has been opened',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isOpened: boolean;

  @ApiProperty({
    description: 'The ID of the campaign',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  campaignId: string;
} 