import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { ResponseDto } from '../common/response.dto';
import { CampaignCostCardDto, CampaignStatsCardDto, CampaignType, CampaignTypeDistributionDto, CostDataPointDto, CountryConcentrationDto, CreateCampaignDto, DashboardFilterDto, DashboardStatsDto, NotificationCardDto, ShareholderConcentrationCardDto, ShareholderSpendingCardDto, SpendingDataPointDto } from './dto/dashboard.dto';
import { ShareHolderService } from 'src/share-holder/share-holder.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService,
    private shareHolderService: ShareHolderService
  ) {}

 

  async getCampaignStatsCard(filter: DashboardFilterDto): Promise<ResponseDto<CampaignStatsCardDto>> {
    try {
      const days = filter.days || 30;
      
      // Calculate the date for comparison (X days ago)
      const currentDate = new Date();
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - days);
      
      // Get current active campaign count
      const activeCampaigns = await this.prisma.campaign.count({
        where: {
          deleted: false,
          status: 'Active',
        },
      });
      
      // Get active campaign count from previous period
      const previousActiveCampaigns = await this.prisma.campaign.count({
        where: {
          deleted: false,
          status: 'Active',
          createdAt: {
            lt: previousDate,
          },
        },
      });
      
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousActiveCampaigns > 0) {
        growthPercentage = ((activeCampaigns - previousActiveCampaigns) / previousActiveCampaigns) * 100;
      }
      
      // Round to one decimal place
      growthPercentage = Math.round(growthPercentage * 10) / 10;
      
      // Get campaign type distribution
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          deleted: false,
          status: 'Active',
        },
        select: {
          campaignDetails: true,
          campaignType: true,
          redeemMethod: true
        },
      });
      
      // Initialize counters for each campaign type based on the UI
      let discountedProductCount = 0;
      let earlyAccessProductCount = 0;
      let earlyAccessEventCount = 0;
      let exclusiveAccessEventCount = 0;

      // Classify campaigns based on actual data format
      campaigns.forEach(campaign => {
        const details = campaign.campaignDetails as any;
        const campaignType = campaign.campaignType as string;
        
        // Classification based on the provided data format and new enum values
        if (
          campaignType === 'DISCOUNTED_PRODUCTS' || 
          details?.formType === 'DISCOUNTED_PRODUCTS' ||
          details?.discount // If discount field exists
        ) {
          discountedProductCount++;
        } 
        else if (
          campaignType === 'EARLY_ACCESS_TO_PRODUCTS' || 
          details?.formType === 'EARLY_ACCESS_TO_PRODUCTS'
        ) {
          earlyAccessProductCount++;
        }
        else if (
          campaignType === 'EARLY_ACCESS_TO_EVENTS' || 
          details?.formType === 'EARLY_ACCESS_TO_EVENTS'
        ) {
          earlyAccessEventCount++;
        }
        else if (
          campaignType === 'EXCLUSIVE_EVENTS' || 
          details?.formType === 'EXCLUSIVE_EVENTS'
        ) {
          exclusiveAccessEventCount++;
        }
        // Default categorization based on content analysis
        else if (
          typeof campaignType === 'string' && 
          (details?.isEvent || campaignType.includes('EVENT'))
        ) {
          if (
            typeof campaignType === 'string' && 
            (details?.isExclusive || campaignType.includes('EXCLUSIVE'))
          ) {
            exclusiveAccessEventCount++;
          } else {
            earlyAccessEventCount++;
          }
        } else {
          // If nothing else matches, check if it contains discount or default to discounted product
          if (
            typeof campaignType === 'string' && 
            (details?.discount || campaignType.includes('DISCOUNT'))
          ) {
            discountedProductCount++;
          } else {
            // If nothing specific, assume it's early access to product
            earlyAccessProductCount++;
          }
        }
      });
      
      const campaignTypeDistribution: CampaignTypeDistributionDto = {
        discountedProductCount,
        earlyAccessProductCount,
        earlyAccessEventCount,
        exclusiveAccessEventCount,
      };
      
      const result: CampaignStatsCardDto = {
        activeCampaignCount: activeCampaigns,
        growthPercentage,
        timePeriod: `Last ${days} days`,
        campaignTypeDistribution,
      };
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Campaign stats card data fetched successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch campaign stats card data',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get campaign cost card data with filtering by date range and campaign type
   */
  async getCampaignCostCard(filter: DashboardFilterDto): Promise<ResponseDto<CampaignCostCardDto>> {
    try {
      // Default to 30 days if no start/end date provided
      let startDate: Date;
      let endDate: Date = new Date();
      let days = 30;
      
      if (filter.startDate && filter.endDate) {
        startDate = new Date(filter.startDate);
        endDate = new Date(filter.endDate);
        
        // Calculate the number of days between start and end date
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (filter.days || days));
      }
      
      // For comparison to calculate growth percentage
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);
      
      // Base filter criteria - focus on date range and campaign type
      const baseWhere = {
        deleted: false,
        ...(filter.campaignType && { campaignType: filter.campaignType }),
      };
      
      // Get total campaign costs for current period
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          ...baseWhere,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          campaignBudget: true,
          campaignType: true,
          createdAt: true
        },
      });
      
      // Calculate total budget for all campaigns in current period
      const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.campaignBudget, 0);
      
      // Get campaign costs for previous period for growth calculation
      const previousCampaigns = await this.prisma.campaign.findMany({
        where: {
          ...baseWhere,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        },
        select: {
          campaignBudget: true
        },
      });
      
      // Calculate total budget for previous period
      const previousTotalCost = previousCampaigns.reduce((sum, campaign) => sum + campaign.campaignBudget, 0);
      
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousTotalCost > 0) {
        growthPercentage = ((totalCost - previousTotalCost) / previousTotalCost) * 100;
      }
      
      // Round to one decimal place
      growthPercentage = Math.round(growthPercentage * 10) / 10;
      
      // Get selected campaign type (default to DISCOUNTED_PRODUCTS if not specified)
      const selectedCampaignType = filter.campaignType || CampaignType.DISCOUNTED_PRODUCTS;
      
      // Generate cost over time (7-day segments)
      const costOverTime: CostDataPointDto[] = [];
      
      // Calculate number of 7-day segments we need
      const segmentCount = Math.ceil(days / 7);
      
      // For each segment, calculate total cost from campaigns in that time range
      for (let i = 0; i < segmentCount; i++) {
        const segmentStart = new Date(startDate);
        segmentStart.setDate(segmentStart.getDate() + (i * 7));
        
        const segmentEnd = new Date(segmentStart);
        segmentEnd.setDate(segmentEnd.getDate() + 6); // 7 days total including start
        
        // Don't go beyond overall end date
        if (segmentEnd > endDate) {
          segmentEnd.setTime(endDate.getTime());
        }
        
        // Filter campaigns that fall within this segment
        const segmentCampaigns = campaigns.filter(campaign => {
          const campaignDate = new Date(campaign.createdAt);
          return campaignDate >= segmentStart && campaignDate <= segmentEnd;
        });
        
        // Calculate total cost for this segment
        const segmentCost = segmentCampaigns.reduce((sum, campaign) => sum + campaign.campaignBudget, 0);
        
        // Format the segment label (e.g., "01-07")
        const segmentLabel = `${segmentStart.getDate().toString().padStart(2, '0')}-${segmentEnd.getDate().toString().padStart(2, '0')}`;
        
        costOverTime.push({
          label: segmentLabel,
          value: segmentCost
        });
      }
      
      const result: CampaignCostCardDto = {
        totalCost,
        growthPercentage,
        timePeriod: `Last ${days} days`,
        selectedCampaignType,
        costOverTime
      };
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Campaign cost card data fetched successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch campaign cost card data',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get shareholder concentration data by broker with date range filtering
   */
  async getShareholderConcentration(filter: DashboardFilterDto): Promise<ResponseDto<ShareholderConcentrationCardDto>> {
    try {
      // Default to 30 days if no start/end date provided
      let startDate: Date;
      let endDate: Date = new Date();
      let days = 30;
      
      if (filter.startDate && filter.endDate) {
        startDate = new Date(filter.startDate);
        endDate = new Date(filter.endDate);
        
        // Calculate the number of days between start and end date
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (filter.days || days));
      }
      
      // For comparison to calculate growth percentage
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);
      
      // Get all shareholders within date range
      const shareholders = await this.prisma.shareHolder.findMany({
        where: {
          deleted: false,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          shares: {
            include: {
              brooker: true
            }
          }
        }
      });

      // Get shareholders from previous period for growth calculation
      const previousShareholders = await this.prisma.shareHolder.count({
        where: {
          deleted: false,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      });
      
      // Calculate total shareholders count
      const totalShareholderCount = shareholders.length;
      
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousShareholders > 0) {
        growthPercentage = ((totalShareholderCount - previousShareholders) / previousShareholders) * 100;
      }
      
      // Round to one decimal place
      growthPercentage = Math.round(growthPercentage * 10) / 10;
      
      // Organize shareholders by broker
      const brokerMap: Map<string, number> = new Map();
      
      // Count shareholders by broker
      shareholders.forEach(shareholder => {
        shareholder.shares.forEach(share => {
          if (share.brooker) {
            const brokerName = share.brooker.name;
            if (brokerMap.has(brokerName)) {
              brokerMap.set(brokerName, brokerMap.get(brokerName) + 1);
            } else {
              brokerMap.set(brokerName, 1);
            }
          }
        });
      });
      
      // Convert map to array and calculate percentages
      const brokerConcentration = Array.from(brokerMap.entries())
        .map(([broker, count]) => ({
          broker,
          count,
          percentage: Math.round((count / totalShareholderCount) * 100 * 10) / 10
        }))
        // Sort by count in descending order
        .sort((a, b) => b.count - a.count);
      
      const result: ShareholderConcentrationCardDto = {
        totalShareholderCount,
        growthPercentage,
        timePeriod: `Last ${days} days`,
        brokerConcentration
      };
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Shareholder concentration data fetched successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch shareholder concentration data',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get notification card data with date filtering
   */
  async getNotificationCard(filter: DashboardFilterDto): Promise<ResponseDto<NotificationCardDto>> {
    try {
      // Default to 30 days if no start/end date provided
      let startDate: Date;
      let endDate: Date = new Date();
      let days = 30;
      
      if (filter.startDate && filter.endDate) {
        startDate = new Date(filter.startDate);
        endDate = new Date(filter.endDate);
        
        // Calculate the number of days between start and end date
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (filter.days || days));
      }
      
      // For comparison to calculate growth percentage
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);
      
      // Get all delivery methods within the date range
      const deliveryMethods = await this.prisma.deliveryMethod.findMany({
        where: {
          deleted: false,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          Campaign: {
            select: {
              id: true
            }
          }
        }
      });
      
      // Get delivery methods from previous period for growth calculation
      const previousDeliveryMethods = await this.prisma.deliveryMethod.findMany({
        where: {
          deleted: false,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      });
      
      // Calculate total notifications as sum of maxCount from all delivery methods
      const totalNotifications = deliveryMethods.reduce((sum, method) => sum + method.maxCount, 0);
      const previousTotalNotifications = previousDeliveryMethods.reduce((sum, method) => sum + method.maxCount, 0);
      
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousTotalNotifications > 0) {
        growthPercentage = ((totalNotifications - previousTotalNotifications) / previousTotalNotifications) * 100;
      }
      
      // Round growth percentage to two decimal places
      growthPercentage = Math.round(growthPercentage * 100) / 100;
      
      // Get campaign IDs from delivery methods to fetch related data
      const campaignIds = deliveryMethods.map(method => method.campaignId);
      
      // Fetch campaign clicks for the campaigns
      const campaignClicks = await this.prisma.campaignClicks.count({
        where: {
          deleted: false,
          campaignId: {
            in: campaignIds
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      // Fetch campaign emails for the campaigns
      const campaignEmails = await this.prisma.campaignEmails.findMany({
        where: {
          deleted: false,
          campaignId: {
            in: campaignIds
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      
      // Calculate proper failure rate as a percentage
      // Failure rate is the percentage of notifications that users didn't interact with
      // Success is measured by campaign clicks vs total notifications sent
      const expectedResponses = totalNotifications; // Total notifications that should have been interacted with
      const successfulInteractions = campaignClicks; // Total notifications that were actually interacted with
      const failedInteractions = Math.max(0, expectedResponses - successfulInteractions);
      const failureRate = expectedResponses > 0 ? (failedInteractions / expectedResponses) * 100 : 0;
      
      // Get successfully notified shareholders count (offers redeemed)
      const notifiedShareholderCount = await this.prisma.campaignOfferRedeemed.count({
        where: {
          deleted: false,
          campaignId: {
            in: campaignIds
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      // Group delivery methods by type and sum maxCount for each type
      const methodCounts = new Map<string, number>();
      
      deliveryMethods.forEach(method => {
        const type = method.type.toString();
        const currentCount = methodCounts.get(type) || 0;
        methodCounts.set(type, currentCount + method.maxCount);
      });
      
      // Get count for In App Push Notification
      const inAppNotificationCount = methodCounts.get('IN_APP_NOTIFICATION') || 0;
      
      // Get count for Email notifications
      const emailCount = methodCounts.get('EMAIL') || 0;
      
      // Format for nice display with K suffix
      const formatNumber = (num: number): string => {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
      };
      
      const result: NotificationCardDto = {
        totalNotifications,
        growthPercentage,
        timePeriod: `Last ${days} days`,
        notificationMethods: [
          {
            method: 'In App Push Notification',
            count: inAppNotificationCount
          },
          {
            method: 'Email',
            count: emailCount
          }
        ],
        applicationStatus: {
          notifiedShareholderCount,
          failureRate: Math.round(failureRate * 10) / 10 // Round to 1 decimal place
        }
      };
      
      // Add formatted versions of counts for UI display
      const formattedResult = {
        ...result,
        totalNotificationsFormatted: formatNumber(totalNotifications),
        notificationMethods: [
          {
            method: 'In App Push Notification',
            count: inAppNotificationCount,
            countFormatted: formatNumber(inAppNotificationCount)
          },
          {
            method: 'Email',
            count: emailCount,
            countFormatted: formatNumber(emailCount)
          }
        ],
        applicationStatus: {
          notifiedShareholderCount,
          notifiedShareholderCountFormatted: formatNumber(notifiedShareholderCount),
          failureRate: Math.round(failureRate * 10) / 10 // Round to 1 decimal place
        }
      };
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification card data fetched successfully',
        data: formattedResult,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch notification card data',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get shareholder campaign spending card data with filtering by date range and campaign
   */
  async getShareholderSpendingCard(filter: DashboardFilterDto): Promise<ResponseDto<ShareholderSpendingCardDto>> {
    try {
      // Default to 30 days if no start/end date provided
      let startDate: Date;
      let endDate: Date = new Date();
      let days = 30;
      
      if (filter.startDate && filter.endDate) {
        startDate = new Date(filter.startDate);
        endDate = new Date(filter.endDate);
        
        // Calculate the number of days between start and end date
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (filter.days || days));
      }
      
      // For comparison to calculate growth percentage
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);
      
      // Base filter criteria - focus on date range, campaign type, and specific campaign ID
      const baseWhere = {
        deleted: false,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(filter.campaignId && { campaignId: filter.campaignId }),
      };
      
      // Get campaign filter if provided
      const campaignFilter = filter.campaignType ? {
        campaign: {
          campaignType: filter.campaignType
        }
      } : {};
      
      // Get all campaign offer redemptions within date range
      const campaignOfferRedeemed = await this.prisma.campaignOfferRedeemed.findMany({
        where: {
          ...baseWhere,
          ...campaignFilter
        },
        include: {
          campaign: {
            select: {
              campaignBudget: true,
              campaignType: true,
              createdAt: true
            }
          }
        }
      });
      
      // Calculate total spending as the sum of campaign budgets for all redeemed offers
      // Each redemption represents a shareholder's spending on the campaign
      const totalSpending = campaignOfferRedeemed.reduce((sum, record) => {
        return sum + (record.campaign?.campaignBudget || 0);
      }, 0);
      
      // Get previous period redemptions for growth calculation
      const previousBaseWhere = {
        deleted: false,
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        },
        ...(filter.campaignId && { campaignId: filter.campaignId }),
      };
      
      const previousCampaignOfferRedeemed = await this.prisma.campaignOfferRedeemed.findMany({
        where: {
          ...previousBaseWhere,
          ...campaignFilter
        },
        include: {
          campaign: {
            select: {
              campaignBudget: true
            }
          }
        }
      });
      
      // Calculate total spending for previous period
      const previousTotalSpending = previousCampaignOfferRedeemed.reduce((sum, record) => {
        return sum + (record.campaign?.campaignBudget || 0);
      }, 0);
      
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousTotalSpending > 0) {
        growthPercentage = ((totalSpending - previousTotalSpending) / previousTotalSpending) * 100;
      }
      
      // Round to two decimal places
      growthPercentage = Math.round(growthPercentage * 100) / 100;
      
      // Generate spending over time (7-day segments for the graph)
      const spendingOverTime: SpendingDataPointDto[] = [];
      
      // Calculate number of 7-day segments we need
      const segmentCount = Math.ceil(days / 7);
      
      // For each segment, calculate total spending from redeemed offers in that time range
      for (let i = 0; i < segmentCount; i++) {
        const segmentStart = new Date(startDate);
        segmentStart.setDate(segmentStart.getDate() + (i * 7));
        
        const segmentEnd = new Date(segmentStart);
        segmentEnd.setDate(segmentEnd.getDate() + 6); // 7 days total including start
        
        // Don't go beyond overall end date
        if (segmentEnd > endDate) {
          segmentEnd.setTime(endDate.getTime());
        }
        
        // Filter redemptions that fall within this segment
        const segmentRedemptions = campaignOfferRedeemed.filter(record => {
          const redemptionDate = new Date(record.createdAt);
          return redemptionDate >= segmentStart && redemptionDate <= segmentEnd;
        });
        
        // Calculate total spending for this segment
        const segmentSpending = segmentRedemptions.reduce((sum, record) => {
          return sum + (record.campaign?.campaignBudget || 0);
        }, 0);
        
        // Format the segment label (e.g., "01-07")
        const segmentLabel = `${segmentStart.getDate().toString().padStart(2, '0')}-${segmentEnd.getDate().toString().padStart(2, '0')}`;
        
        spendingOverTime.push({
          label: segmentLabel,
          value: segmentSpending
        });
      }
      
      // Get selected campaign type if provided
      const selectedCampaignType = filter.campaignType;
      
      // Format the total spending with currency and suffix
      const formatCurrency = (amount: number): string => {
        if (amount >= 1000000) {
          return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
          return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toFixed(2)}`;
      };
      
      const result: ShareholderSpendingCardDto = {
        totalSpending,
        growthPercentage,
        timePeriod: `Last ${days} days`,
        selectedCampaignType,
        campaignId: filter.campaignId,
        spendingOverTime
      };
      
      // Add formatted total spending for UI display
      const formattedResult = {
        ...result,
        totalSpendingFormatted: formatCurrency(totalSpending)
      };
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Shareholder campaign spending data fetched successfully',
        data: formattedResult,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch shareholder campaign spending data',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get shareholder concentration by country with date range filtering
   */
  async getShareholdersByCountry(filter: DashboardFilterDto): Promise<ResponseDto<CountryConcentrationDto[]>> {
    try {
      // Default to 30 days if no start/end date provided
      let startDate: Date;
      let endDate: Date = new Date();
      
      if (filter.startDate && filter.endDate) {
        startDate = new Date(filter.startDate);
        endDate = new Date(filter.endDate);
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (filter.days || 30));
      }
      
      // Get all shareholders within date range
      const shareholders = await this.prisma.shareHolder.findMany({
        where: {
          deleted: false,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          country: true
        }
      });
      
      // Calculate total shareholders count
      const totalShareholderCount = shareholders.length;
      
      // Group shareholders by country
      const countryMap: Map<string, number> = new Map();
      
      // Count shareholders by country
      shareholders.forEach(shareholder => {
        const country = shareholder.country || 'Unknown';
        if (countryMap.has(country)) {
          countryMap.set(country, countryMap.get(country) + 1);
        } else {
          countryMap.set(country, 1);
        }
      });
      
      // Convert map to array and calculate percentages
      const countryConcentration = Array.from(countryMap.entries())
        .map(([country, count]) => ({
          country,
          count,
          percentage: Math.round((count / totalShareholderCount) * 100 * 10) / 10
        }))
        // Sort by count in descending order
        .sort((a, b) => b.count - a.count);
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Shareholder concentration by country fetched successfully',
        data: countryConcentration,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch shareholder concentration by country',
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get all shareholders
   */
  async getAllShareholders(): Promise<ResponseDto<any>> {
    try {
      // Create an empty GetShareHolderDto with required fields initialized as undefined
      const emptyFilters = {
        age: undefined,
        income: undefined
      };

      // Using the ShareHolderService's findAll method with empty query filters
      const shareholders = await this.shareHolderService.findAll(emptyFilters);

      return {
        statusCode: HttpStatus.OK,
        message: 'Shareholders fetched successfully',
        data: shareholders.data,
        status: true
      };
    } catch (error) {
      return {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch shareholders',
        error: error.message,
        data: null,
      };
    }
  }
} 