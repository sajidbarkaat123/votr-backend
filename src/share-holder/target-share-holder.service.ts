import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShareHolderDto } from './dto/create-share-holder.dto';
import { UpdateShareHolderDto } from './dto/update-share-holder.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateTargetShareHolderDto } from './dto/create-target-share-holder.dto';

@Injectable()
export class TargetShareHolderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTargetShareHolderDto: CreateTargetShareHolderDto) {
     const targetShareHolder=this.prisma.targetShareHoldersInfo.create({
      data: createTargetShareHolderDto,
    });
    return targetShareHolder  
}

  async findAll() {
    return this.prisma.shareHolder.findMany({ where: { deleted: false } });
  }

  async findOne(id: string) {
    const targetshareHolder = await this.prisma.targetShareHoldersInfo.findUnique({ where: { id } });
    if (!targetshareHolder || targetshareHolder.deleted) {
      throw new NotFoundException(`ShareHolder with ID ${id} not found`);
    }
    return targetshareHolder;
  }

  async update(id: string, updateShareHolderDto: UpdateShareHolderDto) {
    return this.prisma.shareHolder.update({
      where: { id },
      data: updateShareHolderDto,
    });
  }

  async remove(id: string) {
    return this.prisma.shareHolder.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
