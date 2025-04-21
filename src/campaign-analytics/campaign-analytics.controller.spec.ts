import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAnalyticsController } from './campaign-analytics.controller';
import { CampaignAnalyticsService } from './campaign-analytics.service';

describe('CampaignAnalyticsController', () => {
  let controller: CampaignAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignAnalyticsController],
      providers: [CampaignAnalyticsService],
    }).compile();

    controller = module.get<CampaignAnalyticsController>(CampaignAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
