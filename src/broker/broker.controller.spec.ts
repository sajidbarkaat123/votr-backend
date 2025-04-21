import { Test, TestingModule } from '@nestjs/testing';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';
import { PrismaService } from '../shared/prisma/prisma.service';

describe('BrokerController', () => {
  let controller: BrokerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerController],
      providers: [
        BrokerService,
        {
          provide: PrismaService,
          useValue: {
            brooker: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            shares: {
              aggregate: jest.fn(),
              findMany: jest.fn(),
            },
            campaignRewardClaim: {
              findMany: jest.fn(),
            },
            campaign: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<BrokerController>(BrokerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
