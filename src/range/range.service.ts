import { Injectable } from '@nestjs/common';
import { CreateRangeDto } from './dto/create-range.dto';
import { UpdateRangeDto } from './dto/update-range.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ResponseDto } from 'src/common/response.dto';
import { Ranges } from '@prisma/client';

@Injectable()
export class RangeService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createRangeDto: CreateRangeDto) :Promise<ResponseDto<Ranges>>{
    const range = await this.prisma.ranges.create({ data: createRangeDto });
    return {
      data: range,
      message: 'Range created successfully',
      statusCode: 201,
      status: true
    }
  }

  findAll() {
    return `This action returns all range`;
  }

  findOne(id: number) {
    return `This action returns a #${id} range`;
  }

  update(id: number, updateRangeDto: UpdateRangeDto) {
    return `This action updates a #${id} range`;
  }

  remove(id: number) {
    return `This action removes a #${id} range`;
  }
}
