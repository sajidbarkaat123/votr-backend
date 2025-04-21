import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CampaignCostCardDto, CampaignStatsCardDto, CampaignType, CountryConcentrationDto, CreateCampaignDto, DashboardFilterDto, NotificationCardDto, ShareholderConcentrationCardDto, ShareholderSpendingCardDto } from './dto/dashboard.dto';
import { ResponseDto } from '../common/response.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  

  @Get('campaign-stats-card')
  @ApiOperation({ summary: 'Get campaign statistics card data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign statistics card data with active campaign count and campaign type distribution' 
  })
  async getCampaignStatsCard(@Query() filter: DashboardFilterDto): Promise<ResponseDto<CampaignStatsCardDto>> {
    return this.dashboardService.getCampaignStatsCard(filter);
  }

  @Get('campaign-cost-card')
  @ApiOperation({ summary: 'Get campaign cost card data with time-based filtering' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign cost card data with total cost and cost over time in 7-day segments' 
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Start date for filtering campaigns' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'End date for filtering campaigns' })
  @ApiQuery({ name: 'campaignType', required: false, enum: CampaignType, description: 'Filter by campaign type' })
  async getCampaignCostCard(@Query() filter: DashboardFilterDto): Promise<ResponseDto<CampaignCostCardDto>> {
    return this.dashboardService.getCampaignCostCard(filter);
  }

  @Get('campaign-types')
  @ApiOperation({ summary: 'Get campaign types' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all available campaign types' 
  })
  async getCampaignTypes(): Promise<ResponseDto<{[key: string]: string}>> {
    // Return the campaign types as options for the UI
    const campaignTypes = {
      DISCOUNTED_PRODUCTS: 'Discounted product / service',
      EARLY_ACCESS_TO_PRODUCTS: 'Early access to product / service',
      EARLY_ACCESS_TO_EVENTS: 'Early Access to Company Sponsored Event',
      EXCLUSIVE_EVENTS: 'Exclusive Access to Company Event',
    };

    return {
      statusCode: 200,
      message: 'Campaign types fetched successfully',
      data: campaignTypes
    };
  }

  @Get('shareholder-concentration')
  @ApiOperation({ summary: 'Get shareholder concentration by broker' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns shareholder concentration data grouped by broker with total count and percentages' 
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Start date for filtering shareholders' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'End date for filtering shareholders' })
  async getShareholderConcentration(@Query() filter: DashboardFilterDto): Promise<ResponseDto<ShareholderConcentrationCardDto>> {
    return this.dashboardService.getShareholderConcentration(filter);
  }

  @Get('shareholders-by-country')
  @ApiOperation({ summary: 'Get shareholder concentration by country' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns shareholder concentration data grouped by country with count and percentages' 
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Start date for filtering shareholders' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'End date for filtering shareholders' })
  async getShareholdersByCountry(@Query() filter: DashboardFilterDto): Promise<ResponseDto<CountryConcentrationDto[]>> {
    return this.dashboardService.getShareholdersByCountry(filter);
  }

  @Get('notification-card')
  @ApiOperation({ summary: 'Get notification statistics card data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns notification statistics with total count, methods breakdown and application status' 
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Start date for filtering notifications' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'End date for filtering notifications' })
  async getNotificationCard(@Query() filter: DashboardFilterDto): Promise<ResponseDto<NotificationCardDto>> {
    return this.dashboardService.getNotificationCard(filter);
  }

  @Get('shareholder-spending-card')
  @ApiOperation({ summary: 'Get shareholder campaign spending data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns shareholder campaign spending data with total spending and spending over time in 7-day segments' 
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Start date for filtering campaigns' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'End date for filtering campaigns' })
  @ApiQuery({ name: 'campaignId', required: false, type: String, description: 'Filter by specific campaign ID' })
  async getShareholderSpendingCard(@Query() filter: DashboardFilterDto): Promise<ResponseDto<ShareholderSpendingCardDto>> {
    return this.dashboardService.getShareholderSpendingCard(filter);
  }

  @Get('shareholders')
  @ApiOperation({ summary: 'Get all shareholders' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all shareholders in the system' 
  })
  async getAllShareholders(): Promise<ResponseDto<any>> {
    return this.dashboardService.getAllShareholders();
  }
} 