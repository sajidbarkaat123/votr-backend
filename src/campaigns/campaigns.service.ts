import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { campaignDetails } from './campaigns.data';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { TargetShareHolderService } from 'src/share-holder/target-share-holder.service';
import { ICampaignStatuses, IDeliveryMethod } from 'src/common/types';
import { ShareHolderService } from 'src/share-holder/share-holder.service';
import { CreateDeliveryMethodDto, createManyDeliveryMethodDto } from './dto/create-delivey-method.dto';
import { CreateCampaignEmailDto } from './dto/create-campaign-email.dto';
import { CreateCampaignClickDto } from './dto/create-campaign-click.dto';
import { CreateCampaignOfferRedeemedDto } from './dto/create-campaign-offer-redeemed.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService,
    private readonly targetShareHolderService: TargetShareHolderService,
    private readonly shareHolderService: ShareHolderService
  ) { }

  async create(createCampaignDto: CreateCampaignDto, productImage?: any) {
    const {
      title,
      campaignBudget,
      campaignType,
      campaignDetails,
      campaignGoals,
      notes,
      startDate,
      endAutomatically,
      endDate,
      status,
      category,
      isPreOrder,
      shareHolderIds,
      deliveryMethods,
      campaignOwner,
      description,
      campaignAccess,
      removeCampaignAccess,
      redeemMethod,
      ...rest
    } = createCampaignDto

    // Process the uploaded image if provided
    let finalCampaignDetails = campaignDetails ? { ...campaignDetails as object } : {};

    if (productImage) {
      const imageUrl = await this.uploadProductImage(productImage);
      // Add the image URL to the campaignDetails JSON
      finalCampaignDetails = {
        ...finalCampaignDetails,
        productImage: imageUrl
      };
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        title,
        campaignBudget,
        campaignType,
        campaignDetails: finalCampaignDetails, // Use the updated campaign details with image
        campaignGoals,
        notes,
        startDate,
        endAutomatically,
        endDate,
        status,
        category,
        isPreOrder,
        campaignOwner,
        description, campaignAccess, removeCampaignAccess,
        redeemMethod
      }
    })
    if (shareHolderIds) {
      await this.shareHolderService.updateCampaignShareholders(campaign.id, shareHolderIds);
    }
    await this.targetShareHolderService.create({ campaignId: campaign.id, ...rest })
    const updatedDeliveryMethods = this.addCampaignIdToDeliveryMethods(campaign.id, deliveryMethods)
    await this.createDeliveryMethod({ data: updatedDeliveryMethods })
    const result = {
      _id: campaign.id,
      brokersIncluded: 20,
      campaignName: campaign.title,
      category: campaign.category,
      endDate: campaign.endDate,
      preOrder: campaign.endAutomatically,
      startDate: campaign.startDate,
      status: campaign.status as ICampaignStatuses,

    }
    return result
  }

  async createDeliveryMethod(createManyDeliveryMethodDto: createManyDeliveryMethodDto) {

    // Ensure all delivery methods have a campaignId
    const deliveryMethodsWithCampaignId = createManyDeliveryMethodDto.data.map(method => {
      if (!method.campaignId) {
        throw new Error('Campaign ID is required for delivery methods');
      }
      // Return only the fields needed by Prisma
      return {
        type: method.type,
        maxCount: method.maxCount,
        preferedTime: method.preferedTime,
        campaignId: method.campaignId
      };
    });

    await this.prisma.deliveryMethod.createMany({
      data: deliveryMethodsWithCampaignId
    });
  }

  findAll() {
    const campaigns = this.prisma.campaign.findMany()
    return campaigns
  }

 async findOne(id: string) {
    const {campaignDetails,...rest} = await this.prisma.campaign.findUnique({
      where: {
        id,
        deleted: false
      },
      include: {
        targetShareHoldersInfo: true,
        DeliveryMethod: true
      }
    })
    const productImage = (campaignDetails as any)?.productImage
    delete (campaignDetails as any)?.productImage
    return {
      ...rest,
    campaignDetails,
      productImage
    }
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto, productImage?: any) {
    const {
      title,
      campaignBudget,
      campaignType,
      campaignDetails,
      campaignGoals,
      notes,
      startDate,
      endAutomatically,
      endDate,
      isPreOrder,
      shareHolderIds,
      deliveryMethods,
      campaignOwner,
      description,
      campaignAccess,
      removeCampaignAccess,
      redeemMethod,
      status,
      category,
      ...rest
    } = updateCampaignDto;

    // Get existing campaign details
    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id }
    });

    let finalCampaignDetails = campaignDetails ? { ...campaignDetails as object } :
      existingCampaign?.campaignDetails ? { ...existingCampaign.campaignDetails as object } : {};

    if (productImage) {
      const imageUrl = await this.uploadProductImage(productImage);
      finalCampaignDetails = {
        ...finalCampaignDetails,
        productImage: imageUrl
      };
    }

    // Update the campaign
    const campaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        title,
        campaignBudget,
        campaignType,
        campaignDetails: finalCampaignDetails,
        campaignGoals,
        notes,
        startDate,
        endAutomatically,
        endDate,
        isPreOrder,
        campaignOwner,
        description,
        campaignAccess,
        removeCampaignAccess,
        redeemMethod,
        status,
        category
      }
    });

    // Update shareholders if provided
    if (shareHolderIds) {
      await this.shareHolderService.updateCampaignShareholders(campaign.id, shareHolderIds);
    }

    // Update target shareholders if rest data is provided
    if (Object.keys(rest).length > 0) {
      // Find the target shareholder ID first
      const targetShareHolder = await this.prisma.targetShareHoldersInfo.findFirst({
        where: { campaignId: campaign.id }
      });

      if (targetShareHolder) {
        // Update existing target shareholder
        await this.prisma.targetShareHoldersInfo.update({
          where: { id: targetShareHolder.id },
          data: { ...rest, campaignId: campaign.id }
        });
      } else {
        // If no target shareholder exists, create one
        // Ensure all required fields are present
        if (rest.region && rest.gender && rest.age && rest.income) {
          // Cast the rest object to CreateTargetShareHolderDto to satisfy TypeScript
          const createTargetShareHolderDto = {
            region: Array.isArray(rest.region) ? rest.region : [rest.region],
            gender: rest.gender,
            age: rest.age,
            income: rest.income,
            campaignId: campaign.id,
            minstockOwnerShipStake: rest.minstockOwnerShipStake,
            maxstockOwnerShipStake: rest.maxstockOwnerShipStake,
            stockOwninBetween: rest.stockOwninBetween
          };

          await this.targetShareHolderService.create(createTargetShareHolderDto);
        }
      }
    }

    // Update delivery methods if provided
    if (deliveryMethods && deliveryMethods.length > 0) {
      // First delete existing delivery methods
      await this.prisma.deliveryMethod.deleteMany({
        where: { campaignId: campaign.id }
      });

      // Then create new ones
      const updatedDeliveryMethods = this.addCampaignIdToDeliveryMethods(campaign.id, deliveryMethods);
      await this.createDeliveryMethod({ data: updatedDeliveryMethods });
    }

    // Return the updated campaign in the same format as create
    const result = {
      _id: campaign.id,
      brokersIncluded: 20,
      campaignName: campaign.title,
      category: campaign.category,
      endDate: campaign.endDate,
      preOrder: campaign.endAutomatically,
      startDate: campaign.startDate,
      status: campaign.status as ICampaignStatuses,
    };

    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }

  addCampaignIdToDeliveryMethods(
    campaignId: string,
    deliveryMethods: CreateDeliveryMethodDto[]
  ): CreateDeliveryMethodDto[] {
    return deliveryMethods.map(dm => ({
      ...dm,
      campaignId
    }));
  }



 

  // Add this method to handle file uploads
  async uploadProductImage(file: any): Promise<string> {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return the URL path to the file
      // This assumes you have a static file serving setup for the uploads directory
      return `/uploads/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }



}