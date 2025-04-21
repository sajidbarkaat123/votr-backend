import { Test, TestingModule } from '@nestjs/testing';
import { BrokerService } from './broker.service';
import { PrismaService } from '../shared/prisma/prisma.service';

describe('BrokerService', () => {
  let service: BrokerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<BrokerService>(BrokerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
