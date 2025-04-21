import { Module } from '@nestjs/common';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { CampaignAnalyticsController } from './campaign-analytics.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CampaignAnalyticsController],
  providers: [CampaignAnalyticsService],
})
export class CampaignAnalyticsModule {}
