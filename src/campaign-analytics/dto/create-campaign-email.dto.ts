import { IsString, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignEmailDto {
  @ApiProperty({ description: 'The ID of the campaign' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'The ID of the recipient user' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Whether the email was opened', required: false })
  @IsOptional()
  @IsBoolean()
  isOpened?: boolean;

  @ApiProperty({ description: 'Whether the email was clicked', required: false })
  @IsOptional()
  @IsBoolean()
  isClicked?: boolean;

  @ApiProperty({ description: 'The timestamp when the email was sent', required: false })
  @IsOptional()
  @IsDate()
  sentAt?: Date;

  @ApiProperty({ description: 'The timestamp when the email was opened', required: false })
  @IsOptional()
  @IsDate()
  openedAt?: Date;
} 