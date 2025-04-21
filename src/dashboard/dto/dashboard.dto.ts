import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum CampaignType {
  DISCOUNTED_PRODUCTS = 'DISCOUNTED_PRODUCTS',
  EARLY_ACCESS_TO_PRODUCTS = 'EARLY_ACCESS_TO_PRODUCTS',
  EARLY_ACCESS_TO_EVENTS = 'EARLY_ACCESS_TO_EVENTS',
  EXCLUSIVE_EVENTS = 'EXCLUSIVE_EVENTS'
}

export class DashboardFilterDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
  
  @IsOptional()
  @IsUUID()
  campaignId?: string;
  
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsNumber()
  days?: number = 30;
  
  @IsOptional()
  @IsEnum(CampaignType)
  campaignType?: CampaignType;
}

export class DashboardStatsDto {
  @IsNumber()
  totalCampaigns: number;
  
  @IsNumber()
  activeCampaigns: number;
  
  @IsNumber()
  completedCampaigns: number;
  
  @IsNumber()
  totalInvestment: number;
}

export class CampaignTypeDistributionDto {
  @IsNumber()
  discountedProductCount: number;
  
  @IsNumber()
  earlyAccessProductCount: number;
  
  @IsNumber()
  earlyAccessEventCount: number;
  
  @IsNumber()
  exclusiveAccessEventCount: number;
}

export class CampaignStatsCardDto {
  @IsNumber()
  activeCampaignCount: number;
  
  @IsNumber()
  growthPercentage: number;
  
  @IsString()
  timePeriod: string;
  
  campaignTypeDistribution: CampaignTypeDistributionDto;
}

// New DTO for cost data point in graph
export class CostDataPointDto {
  @IsString()
  label: string;
  
  @IsNumber()
  value: number;
}

// New DTO for campaign cost card
export class CampaignCostCardDto {
  @IsNumber()
  totalCost: number;
  
  @IsNumber()
  growthPercentage: number;
  
  @IsString()
  timePeriod: string;
  
  @IsEnum(CampaignType)
  selectedCampaignType: CampaignType;
  
  costOverTime: CostDataPointDto[];
}

export class CreateCampaignDto {
  @IsString()
  title: string;
  
  @IsString()
  description: string;
  
  @IsNumber()
  campaignBudget: number;
  
  @IsString()
  campaignGoals: string;
  
  @IsString()
  campaignOwner: string;
  
  @IsDate()
  startDate: Date;
  
  @IsOptional()
  @IsDate()
  endDate?: Date;
  
  @IsOptional()
  @IsString()
  category?: string;
  
  @IsEnum(CampaignType)
  campaignType: CampaignType;
  
  @IsString()
  redeemMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// New DTOs for shareholder concentration card

export class BrokerConcentrationDto {
  @IsString()
  broker: string;

  @IsNumber()
  count: number;

  @IsNumber()
  percentage: number;
}

export class ShareholderConcentrationCardDto {
  @IsNumber()
  totalShareholderCount: number;

  @IsNumber()
  growthPercentage: number;

  @IsString()
  timePeriod: string;

  brokerConcentration: BrokerConcentrationDto[];
}

// New DTOs for notification card
export class NotificationMethodDto {
  @IsString()
  method: string;
  
  @IsNumber()
  count: number;
  
  @IsOptional()
  @IsString()
  countFormatted?: string;
}

export class ApplicationStatusDto {
  @IsNumber()
  notifiedShareholderCount: number;
  
  @IsOptional()
  @IsString()
  notifiedShareholderCountFormatted?: string;
  
  @IsNumber()
  failureRate: number;
}

export class NotificationCardDto {
  @IsNumber()
  totalNotifications: number;
  
  @IsOptional()
  @IsString()
  totalNotificationsFormatted?: string;
  
  @IsNumber()
  growthPercentage: number;
  
  @IsString()
  timePeriod: string;
  
  notificationMethods: NotificationMethodDto[];
  
  applicationStatus: ApplicationStatusDto;
}

// DTO for spending data point in graph
export class SpendingDataPointDto {
  @IsString()
  label: string;
  
  @IsNumber()
  value: number;
}

// DTO for shareholder campaign spending card
export class ShareholderSpendingCardDto {
  @IsNumber()
  totalSpending: number;
  
  @IsOptional()
  @IsString()
  totalSpendingFormatted?: string;
  
  @IsNumber()
  growthPercentage: number;
  
  @IsString()
  timePeriod: string;
  
  @IsOptional()
  @IsEnum(CampaignType)
  selectedCampaignType?: CampaignType;
  
  @IsOptional()
  @IsString()
  campaignId?: string;
  
  spendingOverTime: SpendingDataPointDto[];
}

// DTO for country concentration data
export class CountryConcentrationDto {
  @IsString()
  country: string;

  @IsNumber()
  count: number;

  @IsNumber()
  percentage: number;
} 