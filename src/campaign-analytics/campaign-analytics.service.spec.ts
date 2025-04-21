import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAnalyticsService } from './campaign-analytics.service';

describe('CampaignAnalyticsService', () => {
  let service: CampaignAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignAnalyticsService],
    }).compile();

    service = module.get<CampaignAnalyticsService>(CampaignAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
