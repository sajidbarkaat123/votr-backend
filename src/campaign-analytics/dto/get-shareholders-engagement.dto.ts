import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CampaignAnalyticsBaseDto } from './campaign-analytics-base.dto';

enum TimeGrouping {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export class GetShareholdersEngagementDto extends CampaignAnalyticsBaseDto {
  @ApiProperty({
    description: 'How to group the time series data',
    enum: TimeGrouping,
    default: TimeGrouping.WEEK,
    required: false
  })
  @IsOptional()
  @IsEnum(TimeGrouping)
  timeGrouping?: TimeGrouping = TimeGrouping.WEEK;
} 