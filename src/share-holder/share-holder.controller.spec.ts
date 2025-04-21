import { Test, TestingModule } from '@nestjs/testing';
import { ShareHolderController } from './share-holder.controller';
import { ShareHolderService } from './share-holder.service';

describe('ShareHolderController', () => {
  let controller: ShareHolderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShareHolderController],
      providers: [ShareHolderService],
    }).compile();

    controller = module.get<ShareHolderController>(ShareHolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
