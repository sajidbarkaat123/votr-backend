import { IsString, IsDate, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RewardStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export class CreateCampaignRewardClaimDto {
  @ApiProperty({ description: 'The ID of the campaign' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'The ID of the user claiming the reward' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The type of reward being claimed' })
  @IsString()
  rewardType: string;

  @ApiProperty({ description: 'The value of the reward', required: false })
  @IsOptional()
  @IsNumber()
  rewardValue?: number;

  @ApiProperty({ description: 'The status of the reward claim', enum: RewardStatus })
  @IsEnum(RewardStatus)
  status: RewardStatus;

  @ApiProperty({ description: 'The timestamp when the reward was claimed', required: false })
  @IsOptional()
  @IsDate()
  claimedAt?: Date;

  @ApiProperty({ description: 'Additional metadata about the claim', required: false })
  @IsOptional()
  @IsString()
  metadata?: string;
} 