import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShareHolderDto } from './dto/create-share-holder.dto';
import { UpdateShareHolderDto } from './dto/update-share-holder.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma, ShareHolder } from '@prisma/client';
import { GENDER } from 'src/common/all.enum';
import { GetShareHolderDto } from './dto/get-share-holders.dto';
import { parseNumber } from 'src/common/utils';
import { ResponseDto } from 'src/common/response.dto';
import { IListing } from 'src/common/types';

@Injectable()
export class ShareHolderService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createShareHolderDto: CreateShareHolderDto) {
    return this.prisma.shareHolder.create({
      data: createShareHolderDto,
    });
  }

  async findAll(queryFilters: GetShareHolderDto): Promise<ResponseDto<IListing<ShareHolder>>> {
    const { country, gender, age, income, stockMaxLimit, stockMinLimit } = queryFilters;
    let ageStartLimit: number | undefined;
    let ageEndLimit: number | undefined;
    let incomeStartLimit: number | undefined;
    let incomeEndLimit: number | undefined;

    if (age) {
      ({ start: ageStartLimit, end: ageEndLimit } = parseNumber(age));
    }
    if (income) {
      ({ start: incomeStartLimit, end: incomeEndLimit } = parseNumber(income));
    }
    const whereConditon: Prisma.ShareHolderWhereInput = {
      ...(country && { country }),
      ...(ageStartLimit && ageEndLimit && { age: { gte: ageStartLimit, lte: ageEndLimit } }),
      ...(gender && { gender }),
      ...(incomeStartLimit && incomeEndLimit && { income: { gte: incomeStartLimit, lte: incomeEndLimit } }),
      ...(stockMinLimit ? {
        shares: {
          some: {}
        }
      } : {})
    }

    let shareHolders = await this.prisma.shareHolder.findMany({
      where: whereConditon,
      include: {
        shares: true,
        _count: {
          select: {
            shares: true
          }
        }
      }
    });

    if (stockMinLimit || stockMaxLimit) {
      shareHolders = shareHolders.filter(shareholder => {
        // We're now using the count of share records to implement stock ownership limits
        // This preserves the API behavior while using the new counting method
        const sharesCount = shareholder._count.shares;
        if (stockMinLimit && stockMaxLimit) {
          return sharesCount >= stockMinLimit && sharesCount <= stockMaxLimit;
        } else if (stockMinLimit) {
          return sharesCount >= stockMinLimit;
        } else if (stockMaxLimit) {
          return sharesCount <= stockMaxLimit;
        }
        return true;
      });
    }

    const shareHoldersCount = shareHolders.length;

    const shareHoldersWithoutShares = shareHolders.map(({ shares, ...rest }) => rest);

    const result: IListing<ShareHolder> = {
      count: shareHoldersCount,
      data: shareHoldersWithoutShares as ShareHolder[]
    }
    return {
      data: result,
      message: "ShareHolders count fetched successfully",
      statusCode: 200,
      status: true
    }
  }

  async findOne(id: string) {
    const shareHolder = await this.prisma.shareHolder.findUnique({ where: { id } });
    if (!shareHolder || shareHolder.deleted) {
      throw new NotFoundException(`ShareHolder with ID ${id} not found`);
    }
    return shareHolder;
  }

  async update(id: string, updateShareHolderDto: UpdateShareHolderDto) {
    return this.prisma.shareHolder.update({
      where: { id },
      data: updateShareHolderDto,
    });
  }
  async updateMany(data: Partial<ShareHolder>, findCondition: Prisma.ShareHolderWhereInput) {
    return this.prisma.shareHolder.updateMany({
      where: findCondition,
      data,
    });

  }

  async updateCampaignShareholders(campaignId: string, shareholderIds: string[]) {
    // Using Prisma's connect method to handle the many-to-many relationship
    // First disconnect all current relationships
    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        shareHolders: {
          set: [] // Clear all connections
        }
      }
    });

    // Then connect the new relationships
    if (shareholderIds.length > 0) {
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          shareHolders: {
            connect: shareholderIds.map(id => ({ id }))
          }
        }
      });
    }

    return { success: true };
  }

  async remove(id: string) {
    return this.prisma.shareHolder.update({
      where: { id },
      data: { deleted: true },
    });
  }

 
}
