import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { CreateCampaignClickDto } from './dto/create-campaign-click.dto';
import { CreateCampaignEmailDto } from './dto/create-campaign-email.dto';
import { CreateCampaignOfferRedeemedDto } from './dto/create-campaign-offer-redeemed.dto';
import { CreateCampaignRewardClaimDto } from './dto/create-campaign-reward-claim.dto';
import { GetCampaignShareholdersDto } from './dto/get-campaign-shareholders.dto';
import { GetCampaignAnalyticsDto } from './dto/get-campaign-analytics.dto';
import { GetCampaignClicksDto } from './dto/get-campaign-clicks.dto';
import { GetCampaignEmailsDto } from './dto/get-campaign-emails.dto';
import { GetCampaignOffersRedeemedDto } from './dto/get-campaign-offers-redeemed.dto';
import { GetCampaignRewardsClaimedDto } from './dto/get-campaign-rewards-claimed.dto';
import { GetCampaignSharesDistributionDto } from './dto/get-campaign-shares-distribution.dto';
import { GetShareholdersEngagementDto } from './dto/get-shareholders-engagement.dto';
import { GetShareholderDemographicsDto } from './dto/get-shareholder-demographics.dto';
import { GetShareholderRegionalConcentrationDto } from './dto/get-shareholder-regional-concentration.dto';

@ApiTags('campaign-analytics')
@Controller('campaign-analytics')
export class CampaignAnalyticsController {
  constructor(private readonly campaignAnalyticsService: CampaignAnalyticsService) {}

  @Post('clicks')
  @ApiOperation({ summary: 'Create a new campaign click record' })
  @ApiResponse({ status: 201, description: 'The click record has been successfully created.' })
  createCampaignClick(@Body() createCampaignClickDto: CreateCampaignClickDto) {
    return this.campaignAnalyticsService.createCampaignClick(createCampaignClickDto);
  }

  @Post('emails')
  @ApiOperation({ summary: 'Create a new campaign email record' })
  @ApiResponse({ status: 201, description: 'The email record has been successfully created.' })
  createCampaignEmail(@Body() createCampaignEmailDto: CreateCampaignEmailDto) {
    return this.campaignAnalyticsService.createCampaignEmail(createCampaignEmailDto);
  }

  @Post('offers-redeemed')
  @ApiOperation({ summary: 'Create a new campaign offer redemption record' })
  @ApiResponse({ status: 201, description: 'The offer redemption record has been successfully created.' })
  createCampaignOfferRedeemed(@Body() createCampaignOfferRedeemedDto: CreateCampaignOfferRedeemedDto) {
    return this.campaignAnalyticsService.createCampaignOfferRedeemed(createCampaignOfferRedeemedDto);
  }

  @Post('rewards-claimed')
  @ApiOperation({ summary: 'Create a new campaign reward claim record' })
  @ApiResponse({ status: 201, description: 'The reward claim record has been successfully created.' })
  createCampaignRewardClaim(@Body() createCampaignRewardClaimDto: CreateCampaignRewardClaimDto) {
    return this.campaignAnalyticsService.createCampaignRewardClaim(createCampaignRewardClaimDto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign analytics data filtered by the specified time period' 
  })
  async getCampaignAnalytics(@Query() getCampaignAnalyticsDto: GetCampaignAnalyticsDto) {
    return this.campaignAnalyticsService.getCampaignAnalytics(getCampaignAnalyticsDto);
  }

  @Get('clicks')
  @ApiOperation({ summary: 'Get clicks data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign clicks data filtered by the specified time period' 
  })
  async getCampaignClicks(@Query() getCampaignClicksDto: GetCampaignClicksDto) {
    return this.campaignAnalyticsService.getCampaignClicks(getCampaignClicksDto);
  }

  @Get('emails')
  @ApiOperation({ summary: 'Get emails data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign emails data filtered by the specified time period' 
  })
  async getCampaignEmails(@Query() getCampaignEmailsDto: GetCampaignEmailsDto) {
    return this.campaignAnalyticsService.getCampaignEmails(getCampaignEmailsDto);
  }

  @Get('offers-redeemed')
  @ApiOperation({ summary: 'Get offers redeemed data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign offers redeemed data filtered by the specified time period' 
  })
  async getCampaignOffersRedeemed(@Query() getCampaignOffersRedeemedDto: GetCampaignOffersRedeemedDto) {
    return this.campaignAnalyticsService.getCampaignOffersRedeemed(getCampaignOffersRedeemedDto);
  }

  @Get('rewards-claimed')
  @ApiOperation({ summary: 'Get rewards claimed data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign rewards claimed data filtered by the specified time period' 
  })
  async getCampaignRewardsClaimed(@Query() getCampaignRewardsClaimedDto: GetCampaignRewardsClaimedDto) {
    return this.campaignAnalyticsService.getCampaignRewardsClaimed(getCampaignRewardsClaimedDto);
  }

  @Get('shareholders')
  @ApiOperation({ summary: 'Get shareholders data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign shareholders data' 
  })
  async getCampaignShareholders(@Query() getCampaignShareholdersDto: GetCampaignShareholdersDto) {
    return this.campaignAnalyticsService.getCampaignShareholders(getCampaignShareholdersDto);
  }

  @Get('shares-distribution')
  @ApiOperation({ summary: 'Get shares distribution data for a specific campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns campaign shares distribution data grouped by broker' 
  })
  async getCampaignSharesDistribution(@Query() dto: GetCampaignSharesDistributionDto) {
    return this.campaignAnalyticsService.getCampaignSharesDistribution(dto.campaignId);
  }

  @Get('shareholders-engagement')
  @ApiOperation({ summary: 'Get shareholders engagement over time for dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns total shareholders reached and engagement data over time' 
  })
  async getShareholdersEngagement(@Query() dto: GetShareholdersEngagementDto) {
    return this.campaignAnalyticsService.getShareholdersEngagement(dto);
  }

  @Get('shareholder-demographics')
  @ApiOperation({ summary: 'Get shareholder demographics by age group and broker' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns shareholder demographic concentration by age group and broker' 
  })
  async getShareholderDemographics(@Query() getShareholderDemographicsDto: GetShareholderDemographicsDto) {
    return this.campaignAnalyticsService.getShareholderDemographics(getShareholderDemographicsDto);
  }

  @Get('shareholder-regional-concentration')
  @ApiOperation({ 
    summary: 'Get shareholder concentration by region and country',
    description: 'Returns shareholder concentration by region and country. If campaignId is not provided, returns data for all campaigns active within the specified number of days (default 30).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns shareholder concentration percentages by region and country for a specific campaign or all active campaigns' 
  })
  async getShareholderRegionalConcentration(@Query() dto: GetShareholderRegionalConcentrationDto) {
    return this.campaignAnalyticsService.getShareholderRegionalConcentration(dto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all campaign analytics' })
  // @ApiResponse({ status: 200, description: 'Return all campaign analytics.' })
  // findAll() {
  //   return this.campaignAnalyticsService.findAll();
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a specific campaign analytics by id' })
  // @ApiResponse({ status: 200, description: 'Return the campaign analytics.' })
  // findOne(@Param('id') id: string) {
  //   return this.campaignAnalyticsService.findOne(id);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a campaign analytics' })
  // @ApiResponse({ status: 200, description: 'The campaign analytics has been successfully updated.' })
  // update(@Param('id') id: string, @Body() updateCampaignAnalyticDto: any) {
  //   return this.campaignAnalyticsService.update(id, updateCampaignAnalyticDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a campaign analytics' })
  // @ApiResponse({ status: 200, description: 'The campaign analytics has been successfully deleted.' })
  // remove(@Param('id') id: string) {
  //   return this.campaignAnalyticsService.remove(id);
  // }
}
