import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { User } from '@prisma/client';
import { ResponseDto } from 'src/common/response.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
  ) { }
  async create(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    const { licensesIds, ...rest } = createUserDto;
    const user: User = await this.prisma.user.create({
      data: {
        ...rest,
        ...(licensesIds?.length && {
          licenses: {
            connect: licensesIds.map((id) => ({ id })),
          }
        })
      }
    });
    const result: ResponseDto<User> = {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user ,
    };
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      false
    }
    return user;
  }
  async findAll(): Promise<ResponseDto<User[]>> {
    const users: User[] = await this.prisma.user.findMany({
      where: { deleted: false },
      include: {
        Role: true,
      },
    });
    const result: ResponseDto<User[]> = {
      statusCode: HttpStatus.OK,
      message: 'user fetched successfully',
      data: users,
    };

    return result;
  }

  async findOne(id: string): Promise<ResponseDto<User>> {
    const user: User = await this.prisma.user.findUnique({
      where: { id },
      include: {
        Role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result: ResponseDto<User> = {
      statusCode: HttpStatus.OK,
      message: 'user fetched successfully',
      data: user,
    };
    return result;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const result: ResponseDto<User> = {
      statusCode: HttpStatus.OK,
      message: 'user fetched successfully',
      data: user,
    };
    return result;
  }

  async remove(id: string): Promise<ResponseDto<null>> {
    const user = await this.prisma.user.findUnique({
      where: { id, deleted: false },
    });

    if (!user) {
      console.log('it was here');
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { deleted: true },
    });
    const result: ResponseDto<null> = {
      statusCode: HttpStatus.OK,
      message: 'user deleted successfully',
      data: null,
    };
    return result;
  }
}
