import { Test, TestingModule } from '@nestjs/testing';
import { ShareHolderService } from './share-holder.service';

describe('ShareHolderService', () => {
  let service: ShareHolderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareHolderService],
    }).compile();

    service = module.get<ShareHolderService>(ShareHolderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
