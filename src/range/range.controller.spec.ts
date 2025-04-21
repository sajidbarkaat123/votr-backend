import { Test, TestingModule } from '@nestjs/testing';
import { RangeController } from './range.controller';
import { RangeService } from './range.service';

describe('RangeController', () => {
  let controller: RangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RangeController],
      providers: [RangeService],
    }).compile();

    controller = module.get<RangeController>(RangeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
