import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return expected response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Sam',
        email: 'Sam@example.com',
        roleId: '79327c33-553f-4686-b76b-9d56ed48d251',
        licensesIds: [],
        password: 'securePassword',
      };
      const createdUser = {
        id: '65b642ce-b737-4b3b-85ec-aaf4933557be',
        name: 'Sam',
        email: 'Sam@example.com',
        roleId: '79327c33-553f-4686-b76b-9d56ed48d251',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
      };
      const access_token = 'mocked_access_token';

      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: createdUser,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'Sam@example.com';
      const user = { id: '1', email };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      expect(await service.findByEmail(email)).toEqual(user);
    });

    it('should return false if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      expect(await service.findByEmail('notfound@example.com')).toBeFalsy();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }];
     ( prisma.user.findMany as jest.Mock).mockResolvedValue(users);
      expect(await service.findAll()).toEqual({ statusCode: HttpStatus.OK, message: 'user fetched successfully', data: users });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: '1', email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      expect(await service.findOne('1')).toEqual({ statusCode: HttpStatus.OK, message: 'user fetched successfully', data: user });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const updatedUser = { id: '1', ...updateUserDto };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);
      expect(await service.update('1', updateUserDto)).toEqual({ statusCode: HttpStatus.OK, message: 'user fetched successfully', data: updatedUser });
    });
  });

  describe('remove', () => {
    it('should mark a user as deleted', async () => {
      const user = { id: '1', email: 'test@example.com', deleted: false };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, deleted: true });
      expect(await service.remove('1')).toEqual({ statusCode: HttpStatus.OK, message: 'user deleted successfully', data: null });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
