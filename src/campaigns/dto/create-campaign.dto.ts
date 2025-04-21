import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDate,
  IsObject,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateTargetShareHolderDto } from 'src/share-holder/dto/create-target-share-holder.dto';

// Import CampaignType enum
import { CampaignType, DeliveryMethodType } from '../../common/all.enum';
import { ICampaignStatuses, IDeliveryMethod } from 'src/common/types';
import { CreateDeliveryMethodDto } from './create-delivey-method.dto';

export class CreateCampaignDto extends CreateTargetShareHolderDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  campaignOwner: string;

  @IsNumber()
  @Type(() => Number)
  campaignBudget: number;

  @IsEnum(CampaignType)
  campaignType: CampaignType;

  @IsString()
  campaignGoals: string;

  @IsString()
  notes: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  endAutomatically: boolean;

  @IsString()
  status: ICampaignStatuses;

  @IsString()
  category: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPreOrder: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  shareHolderIds?: string[];

  @IsString()
  campaignAccess: string;

  @IsString()
  removeCampaignAccess: string;

  @IsString()
  redeemMethod: string;

  @IsOptional()
  @IsString()
  productImageUrl?: string;

  // Parse region JSON string into an array
  

  // Other fields...

  // Parse deliveryMethods JSON string into an array of objects
  @Transform(({ value }) => {
   
    
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        
        if (!Array.isArray(parsedValue)) {
          return [];
        }
        
        // Create instances of CreateDeliveryMethodDto
        const result = parsedValue.map(item => {
          const dto = new CreateDeliveryMethodDto();
          dto.type = item.type;
          dto.maxCount = Number(item.maxCount);
          dto.preferedTime = item.preferedTime;
          if (item.campaignId) {
            dto.campaignId = item.campaignId;
          }
          return dto;
        });
        return result;
      } catch (e) {
        console.error("Error in deliveryMethods transformation:", e);
        return [];
      }
    }
    
    if (Array.isArray(value)) {
      const result = value.map(item => {
        const dto = new CreateDeliveryMethodDto();
        dto.type = item.type;
        dto.maxCount = Number(item.maxCount);
        dto.preferedTime = item.preferedTime;
        if (item.campaignId) {
          dto.campaignId = item.campaignId;
        }
        return dto;
      });
      return result;
    }
    
    return [];
  })
  @Type(() => CreateDeliveryMethodDto)
  @ValidateNested({ each: true })
  @IsArray()
  deliveryMethods: CreateDeliveryMethodDto[];

  // Parse campaignDetails JSON string into an object
  @IsObject()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  campaignDetails: Record<string, any>;

  // Add remaining DTO properties as needed...
}


