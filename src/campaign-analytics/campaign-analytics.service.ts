import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateCampaignClickDto } from './dto/create-campaign-click.dto';
import { CreateCampaignEmailDto } from './dto/create-campaign-email.dto';
import { CreateCampaignOfferRedeemedDto } from './dto/create-campaign-offer-redeemed.dto';
import { CreateCampaignRewardClaimDto } from './dto/create-campaign-reward-claim.dto';
import { GetCampaignClicksDto } from './dto/get-campaign-clicks.dto';
import { GetCampaignEmailsDto } from './dto/get-campaign-emails.dto';
import { GetCampaignOffersRedeemedDto } from './dto/get-campaign-offers-redeemed.dto';
import { GetCampaignRewardsClaimedDto } from './dto/get-campaign-rewards-claimed.dto';
import { GetCampaignShareholdersDto } from './dto/get-campaign-shareholders.dto';
import { dateFilter } from '../common/utils';
import { GetCampaignAnalyticsDto } from './dto/get-campaign-analytics.dto';
import { GetShareholdersEngagementDto } from './dto/get-shareholders-engagement.dto';
import { GetShareholderDemographicsDto } from './dto/get-shareholder-demographics.dto';
import { AgeGroupFilter, ShareholderConcentrationLevel } from '../common/all.enum';
import { GetShareholderRegionalConcentrationDto } from './dto/get-shareholder-regional-concentration.dto';
@Injectable()
export class CampaignAnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  async createCampaignClick(createCampaignClickDto: CreateCampaignClickDto) {
    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignClickDto.campaignId }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${createCampaignClickDto.campaignId} not found`);
    }

    // Create the click record
    const click = await this.prisma.campaignClicks.create({
      data: {
        campaignId: campaign.id,

      }
    });

    return click;
  }

  async createCampaignEmail(createCampaignEmailDto: CreateCampaignEmailDto) {
    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignEmailDto.campaignId }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${createCampaignEmailDto.campaignId} not found`);
    }

    // Create the email record
    const email = await this.prisma.campaignEmails.create({
      data: {
        campaignId: createCampaignEmailDto.campaignId,
        isOpened: createCampaignEmailDto.isOpened || false
      }
    });

    return email;
  }

  async createCampaignOfferRedeemed(createCampaignOfferRedeemedDto: CreateCampaignOfferRedeemedDto) {
    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCampaignOfferRedeemedDto.campaignId }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${createCampaignOfferRedeemedDto.campaignId} not found`);
    }

    // Create the offer redeemed record
    const offerRedeemed = await this.prisma.campaignOfferRedeemed.create({
      data: {
        campaignId: createCampaignOfferRedeemedDto.campaignId,
        shareHolderId: createCampaignOfferRedeemedDto.userId
      }
    });

    return offerRedeemed;
  }

  async createCampaignRewardClaim(createCampaignRewardClaimDto: CreateCampaignRewardClaimDto) {
    // Create the reward claim record
    const rewardClaim = await this.prisma.campaignRewardClaim.create({
      data: {
        campaignId: createCampaignRewardClaimDto.campaignId,
        brokerId: createCampaignRewardClaimDto.userId
      }
    });

    return rewardClaim;
  }

  async getCampaignAnalytics(getCampaignAnalyticsDto: GetCampaignAnalyticsDto) {
    const { campaignId, days = 30 } = getCampaignAnalyticsDto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        shareHolders: {
          include: {
            shares: {
              include: {
                brooker: true
              }
            }
          }
        }
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Include date filter in all queries
      const dateFilterCriteria = dateFilter(days);

      // Get counts directly instead of fetching all records
      const totalClicks = await this.prisma.campaignClicks.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      // Fetch the actual click records
      const clickRecords = await this.prisma.campaignClicks.findMany({
        where: {
          campaignId,
          ...dateFilterCriteria
        },
        select: {
          id: true,
          createdAt: true,


        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const totalEmails = await this.prisma.campaignEmails.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      const emailsOpened = await this.prisma.campaignEmails.count({
        where: {
          campaignId,
          isOpened: true,
          ...dateFilterCriteria
        }
      });

      const totalOffersRedeemed = await this.prisma.campaignOfferRedeemed.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      // Fetch the actual offer redeemed records with shareHolder information
      const offerRedeemedRecords = await this.prisma.campaignOfferRedeemed.findMany({
        where: {
          campaignId,
          ...dateFilterCriteria
        },
        include: {
          shareHolder: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const totalRewardsClaimed = await this.prisma.campaignRewardClaim.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status,
          campaignType: campaign.campaignType
        },
        shareHolders: campaign.shareHolders,
        metrics: {
          totalClicks,
          totalEmails,
          emailsOpened,
          emailOpenRate: totalEmails > 0 ? (emailsOpened / totalEmails) * 100 : 0,
          totalOffersRedeemed,
          totalRewardsClaimed,
        },
        records: {
          clicks: clickRecords,
          offersRedeemed: offerRedeemedRecords
        }
      };
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw new Error(`Failed to fetch analytics for campaign ${campaignId}: ${error.message}`);
    }
  }

  // New methods for separate data retrieval

  /**
   * Get campaign clicks data
   */
  async getCampaignClicks(getCampaignClicksDto: GetCampaignClicksDto) {
    const { campaignId, days = 30 } = getCampaignClicksDto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Include date filter in all queries
      const dateFilterCriteria = dateFilter(days);

      // Get count of clicks
      const totalClicks = await this.prisma.campaignClicks.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      // Fetch the actual click records
      const clickRecords = await this.prisma.campaignClicks.findMany({
        where: {
          campaignId,
          ...dateFilterCriteria
        },
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        metrics: {
          totalClicks,
        },
        records: clickRecords
      };
    } catch (error) {
      console.error('Error fetching campaign clicks:', error);
      throw new Error(`Failed to fetch clicks for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get campaign emails data
   */
  async getCampaignEmails(getCampaignEmailsDto: GetCampaignEmailsDto) {
    const { campaignId, days = 30 } = getCampaignEmailsDto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Include date filter in all queries
      const dateFilterCriteria = dateFilter(days);

      // Get email metrics
      const totalEmails = await this.prisma.campaignEmails.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      const emailsOpened = await this.prisma.campaignEmails.count({
        where: {
          campaignId,
          isOpened: true,
          ...dateFilterCriteria
        }
      });

      // Fetch the actual email records
      const emailRecords = await this.prisma.campaignEmails.findMany({
        where: {
          campaignId,
          ...dateFilterCriteria
        },
        select: {
          id: true,
          isOpened: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        metrics: {
          totalEmails,
          emailsOpened,
          emailOpenRate: totalEmails > 0 ? (emailsOpened / totalEmails) * 100 : 0,
        },
        records: emailRecords
      };
    } catch (error) {
      console.error('Error fetching campaign emails:', error);
      throw new Error(`Failed to fetch emails for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get campaign offers redeemed data
   */
  async getCampaignOffersRedeemed(getCampaignOffersRedeemedDto: GetCampaignOffersRedeemedDto) {
    const { campaignId, days = 30 } = getCampaignOffersRedeemedDto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Include date filter in all queries
      const dateFilterCriteria = dateFilter(days);

      // Get offers redeemed count
      const totalOffersRedeemed = await this.prisma.campaignOfferRedeemed.count({
        where: {
          campaignId,
          ...dateFilterCriteria
        }
      });

      // Fetch the actual offer redeemed records with shareHolder information
      const offerRedeemedRecords = await this.prisma.campaignOfferRedeemed.findMany({
        where: {
          campaignId,
          ...dateFilterCriteria
        },
        include: {
          shareHolder: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        metrics: {
          totalOffersRedeemed,
        },
        records: offerRedeemedRecords
      };
    } catch (error) {
      console.error('Error fetching campaign offers redeemed:', error);
      throw new Error(`Failed to fetch offers redeemed for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get campaign rewards claimed data
   */
  async getCampaignRewardsClaimed(getCampaignRewardsClaimedDto: GetCampaignRewardsClaimedDto) {
    const { campaignId, page = 1, limit = 10 } = getCampaignRewardsClaimedDto;
    // Calculate skip based on page and limit
    const skip = (page - 1) * limit;
    const take = limit;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Get rewards claimed count
      const totalRewardsClaimed = await this.prisma.campaignRewardClaim.count({
        where: {
          campaignId
        }
      });

      // Fetch the actual rewards claimed records with pagination
      const rewardsClaimedRecords = await this.prisma.campaignRewardClaim.findMany({
        where: {
          campaignId
        },
        include: {
          broker: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take
      });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        metrics: {
          totalRewardsClaimed,
          totalPages: Math.ceil(totalRewardsClaimed / limit),
          currentPage: page,
          pageSize: limit
        },
        records: rewardsClaimedRecords
      };
    } catch (error) {
      console.error('Error fetching campaign rewards claimed:', error);
      throw new Error(`Failed to fetch rewards claimed for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get campaign shareholders data
   */
  async getCampaignShareholders(getCampaignShareholdersDto: GetCampaignShareholdersDto) {
    const { campaignId } = getCampaignShareholdersDto;

    // Check if the campaign exists and get shareholders
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
        shareHolders: {
          include: {
            shares: {
              include: {
                brooker: true
              }
            }
          }
        }
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        shareHolders: campaign.shareHolders,
        metrics: {
          totalShareHolders: campaign.shareHolders.length,
        }
      };
    } catch (error) {
      console.error('Error fetching campaign shareholders:', error);
      throw new Error(`Failed to fetch shareholders for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get campaign shares distribution data grouped by broker
   */
  async getCampaignSharesDistribution(campaignId: string) {
    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Get all shareholders for this campaign with their shares
      const campaignShareholders = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          shareHolders: {
            include: {
              shares: {
                include: {
                  brooker: true
                }
              }
            }
          }
        }
      });

      if (!campaignShareholders) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
      }

      // Calculate total shares count
      let totalSharesCount = 0;

      // Create a map to track brokers and their associated shareholders
      const brokerMap = new Map();

      // Process the shareholders and their shares
      campaignShareholders.shareHolders.forEach(shareholder => {
        shareholder.shares.forEach(share => {
          // Increment total shares count (now counting records not summing sharesCount)
          totalSharesCount += 1;

          // Get or create broker entry in the map
          if (!brokerMap.has(share.brookerId)) {
            brokerMap.set(share.brookerId, {
              brookerId: share.brookerId,
              brookerName: share.brooker.name,
              shareholderCount: 0,
              totalShares: 0
            });
          }

          // Update broker's data
          const brokerData = brokerMap.get(share.brookerId);
          brokerData.shareholderCount += 1;
          brokerData.totalShares += 1; // Count each record as one share
        });
      });

      // Convert map to array for response
      const sharesDistributionByBroker = Array.from(brokerMap.values());

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        totalSharesCount,
        sharesDistributionByBroker
      };
    } catch (error) {
      console.error('Error fetching campaign shares distribution:', error);
      throw new Error(`Failed to fetch shares distribution for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Formats a day number into a valid date string (01-31)
   * @param day The day number to format
   * @returns A valid day string
   */
  private formatValidDay(day: number): string {
    // Ensure day is between 1 and 31
    const validDay = Math.max(1, Math.min(31, Math.floor(Number(day))));
    return validDay.toString().padStart(2, '0');
  }

  /**
   * Get shareholders engagement data for dashboard visualization
   */
  async getShareholdersEngagement(dto: GetShareholdersEngagementDto) {
    const { campaignId, days = 30, timeGrouping = 'week' } = dto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Get total unique shareholders reached
      const totalShareholdersReached: number = await this.prisma.shareHolder.count({
        where: {
          campaigns: {
            some: {
              id: campaignId
            }
          }
        }
      });

      // Format the total shareholders reached (e.g., 45.3M)
      const formattedTotal: string = totalShareholdersReached >= 1000000
        ? `${(totalShareholdersReached / 1000000).toFixed(1)}M`
        : totalShareholdersReached >= 1000
          ? `${(totalShareholdersReached / 1000).toFixed(1)}K`
          : `${totalShareholdersReached}`;

      // Include date filter
      const dateFilterCriteria: { createdAt: { gte: Date } } = dateFilter(days);

      // Get engagement over time (combining clicks, emails opened, offers redeemed)
      let groupByClause: Record<string, string>;
      let dateFormatStr: string;

      // Set date grouping based on the timeGrouping parameter
      switch (timeGrouping) {
        case 'day':
          groupByClause = { $dayOfMonth: '$createdAt' };
          dateFormatStr = '%d';
          break;
        case 'month':
          groupByClause = { $month: '$createdAt' };
          dateFormatStr = '%m';
          break;
        case 'week':
        default:
          // For weekly grouping, group by day of year and then process into weeks
          groupByClause = { $dayOfYear: '$createdAt' };
          dateFormatStr = '%j';
          break;
      }

      // Define the type for the results of the raw query
      type EngagementDataItem = {
        time_period: number;
        engagement_count: string | number;
      };

      // Get aggregated click data grouped by the specified time period
      // Since we're using Prisma, we need to use its specific syntax for date handling
      const engagementData = await this.prisma.$queryRaw<EngagementDataItem[]>`
        WITH time_periods AS (
          SELECT 
            CASE 
              WHEN ${timeGrouping} = 'day' THEN 
                EXTRACT(DAY FROM "createdAt")
              WHEN ${timeGrouping} = 'month' THEN 
                EXTRACT(MONTH FROM "createdAt")
              ELSE 
                -- For week grouping, ensure we get a valid week number (1-5)
                -- This uses floor division to group days into weeks within a month
                1 + FLOOR((EXTRACT(DAY FROM "createdAt") - 1) / 7)
            END as time_period,
            COUNT(*) as engagement_count
          FROM (
            SELECT "createdAt" FROM "CampaignClicks" 
            WHERE "campaignId" = ${campaignId} AND "createdAt" >= ${dateFilterCriteria.createdAt.gte}
            UNION ALL
            SELECT "createdAt" FROM "CampaignEmails" 
            WHERE "campaignId" = ${campaignId} AND "isOpened" = TRUE AND "createdAt" >= ${dateFilterCriteria.createdAt.gte}
            UNION ALL
            SELECT "createdAt" FROM "CampaignOfferRedeemed" 
            WHERE "campaignId" = ${campaignId} AND "createdAt" >= ${dateFilterCriteria.createdAt.gte}
          ) as engagement_events
          GROUP BY time_period
          ORDER BY time_period
        )
        SELECT 
          time_period,
          engagement_count
        FROM time_periods
      `;
      console.log("this is the engagement data", engagementData)
      
      // Handle case where no engagement data is found
      if (!engagementData || engagementData.length === 0) {
        // Return empty dataset with proper structure
        return {
          total_reached: totalShareholdersReached,
          total_reached_formatted: formattedTotal,
          engagement_over_time: {
            data: [],
            highest_value: 0,
            lowest_value: 0,
            average: 0
          }
        };
      }
      
      // Format the time_period labels based on the grouping
      const formattedEngagementData: Array<{ date_range: string; engagement_count: number }> = engagementData.map((item, index, array) => {
        let dateRange: string;
        if (timeGrouping === 'day') {
          // For daily, use the format like "01-07"
          const day: string = this.formatValidDay(item.time_period);
          // If the next item exists, format as range
          if (index < array.length - 1) {
            const nextDay: string = this.formatValidDay(array[index + 1].time_period);
            dateRange = `${day}-${nextDay}`;
          } else {
            // For the last item, use a single-day format
            dateRange = `${day}`;
          }
        } else if (timeGrouping === 'week') {
          // For weekly grouping, calculate the day range appropriately
          // Calculate week number (1-based) from the time_period
          const weekNum: number = Math.max(1, Math.min(5, Number(item.time_period)));
          
          // Calculate proper start and end days for the week
          const weekStart: string = this.formatValidDay((weekNum - 1) * 7 + 1);
          const weekEnd: string = this.formatValidDay(weekNum * 7);
          
          dateRange = `${weekStart}-${weekEnd}`;
        } else {
          // For monthly, use the month number
          const month: string = Math.max(1, Math.min(12, Number(item.time_period))).toString().padStart(2, '0');
          dateRange = month;
        }

        return {
          date_range: dateRange,
          engagement_count: parseInt(item.engagement_count.toString())
        };
      });

      // Calculate statistics from the engagement data
      const engagementCounts: number[] = formattedEngagementData.map(item => item.engagement_count);
      const highestValue: number = engagementCounts.length > 0 ? Math.max(...engagementCounts) : 0;
      const lowestValue: number = engagementCounts.length > 0 ? Math.min(...engagementCounts) : 0;
      const averageValue: number = engagementCounts.length > 0 
        ? parseFloat((engagementCounts.reduce((sum, count) => sum + count, 0) / engagementCounts.length).toFixed(1))
        : 0;

      return {
        total_reached: totalShareholdersReached,
        total_reached_formatted: formattedTotal,
        engagement_over_time: {
          data: formattedEngagementData,
          highest_value: highestValue,
          lowest_value: lowestValue,
          average: averageValue
        }
      };
    } catch (error) {
      console.error('Error fetching shareholders engagement:', error);
      throw new Error(`Failed to fetch shareholders engagement for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get shareholder demographics data by age group and broker
   */
  async getShareholderDemographics(dto: GetShareholderDemographicsDto) {
    const { campaignId, ageGroup = AgeGroupFilter.ALL } = dto;

    // Check if the campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
      }
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    try {
      // Get all shareholders for this campaign with their shares and brokers
      const campaignShareholders = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          shareHolders: {
            include: {
              shares: {
                include: {
                  brooker: true
                }
              }
            }
          }
        }
      });

      if (!campaignShareholders) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
      }

      // Define age group ranges
      const ageGroups = {
        [AgeGroupFilter.AGE_18_24]: { min: 18, max: 24 },
        [AgeGroupFilter.AGE_25_34]: { min: 25, max: 34 },
        [AgeGroupFilter.AGE_35_44]: { min: 35, max: 44 },
        [AgeGroupFilter.AGE_45_54]: { min: 45, max: 54 },
        [AgeGroupFilter.AGE_55_65]: { min: 55, max: 65 },
        [AgeGroupFilter.AGE_65_PLUS]: { min: 65, max: 120 }, // Upper limit arbitrarily high
      };

      // Create a map to track brokers and their demographic data
      const brokerDemographicMap = new Map();
      
      // Get list of common brokers
      const brokers = await this.prisma.brooker.findMany({
        select: {
          id: true,
          name: true
        }
      });

      // Initialize the brokerDemographicMap with all brokers and age groups
      brokers.forEach(broker => {
        brokerDemographicMap.set(broker.id, {
          brookerId: broker.id,
          brookerName: broker.name,
          ageGroups: Object.values(AgeGroupFilter)
            .filter(ag => ag !== AgeGroupFilter.ALL)
            .reduce((acc, ageGroupKey) => {
              acc[ageGroupKey] = {
                count: 0,
                totalShares: 0,
                concentrationLevel: ShareholderConcentrationLevel.LOW // Default
              };
              return acc;
            }, {})
        });
      });

      // Process shareholders by their age and broker
      campaignShareholders.shareHolders.forEach(shareholder => {
        // Determine which age group this shareholder belongs to
        let shareholderAgeGroup: AgeGroupFilter | null = null;
        for (const [ageGroupKey, ageRange] of Object.entries(ageGroups)) {
          if (shareholder.age >= ageRange.min && shareholder.age <= ageRange.max) {
            shareholderAgeGroup = ageGroupKey as AgeGroupFilter;
            break;
          }
        }

        if (!shareholderAgeGroup) {
          return; // Skip if no age group matches (shouldn't happen with our ranges)
        }

        // If filtering by age group and this shareholder doesn't match, skip
        if (ageGroup !== AgeGroupFilter.ALL && shareholderAgeGroup !== ageGroup) {
          return;
        }

        // Process each share record for this shareholder
        shareholder.shares.forEach(share => {
          // Get broker data from map
          if (brokerDemographicMap.has(share.brookerId)) {
            const brokerData = brokerDemographicMap.get(share.brookerId);
            
            // Update broker's age group data
            if (brokerData && brokerData.ageGroups[shareholderAgeGroup]) {
              brokerData.ageGroups[shareholderAgeGroup].count += 1;
              // Each share record counts as 1 share instead of using sharesCount
              brokerData.ageGroups[shareholderAgeGroup].totalShares += 1;
              
              // Update concentration level based on total shares
              const totalShares = brokerData.ageGroups[shareholderAgeGroup].totalShares;
              if (totalShares >= 1000000) {
                brokerData.ageGroups[shareholderAgeGroup].concentrationLevel = ShareholderConcentrationLevel.HIGH;
              } else if (totalShares >= 500000) {
                brokerData.ageGroups[shareholderAgeGroup].concentrationLevel = ShareholderConcentrationLevel.MEDIUM;
              } else {
                brokerData.ageGroups[shareholderAgeGroup].concentrationLevel = ShareholderConcentrationLevel.LOW;
              }
            }
          }
        });
      });

      // Format the data for response
      const brokerDemographicData = Array.from(brokerDemographicMap.values())
        .map(brokerData => {
          // If filtering by age group, only return that age group's data
          const filteredAgeGroups = ageGroup !== AgeGroupFilter.ALL
            ? { [ageGroup]: brokerData.ageGroups[ageGroup] }
            : brokerData.ageGroups;

          return {
            broker: brokerData.brookerName,
            ageGroups: filteredAgeGroups
          };
        });

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        demographics: {
          brokers: brokerDemographicData,
          // Return all age groups that have data
          ageGroups: ageGroup === AgeGroupFilter.ALL
            ? Object.values(AgeGroupFilter).filter(ag => ag !== AgeGroupFilter.ALL)
            : [ageGroup]
        }
      };
    } catch (error) {
      console.error('Error fetching shareholder demographics:', error);
      throw new Error(`Failed to fetch shareholder demographics for campaign ${campaignId}: ${error.message}`);
    }
  }

  /**
   * Get shareholder regional concentration data by country and region
   */
  async getShareholderRegionalConcentration(dto: GetShareholderRegionalConcentrationDto) {
    const { campaignId, region, days = 30 } = dto;

    try {
      // Define the date range based on days parameter
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Handle the case where no campaignId is provided (get data for all active campaigns)
      if (!campaignId) {
        // Get all active campaigns within the date range
        const activeCampaigns = await this.prisma.campaign.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          select: {
            id: true,
            title: true,
          }
        });

        if (!activeCampaigns.length) {
          return {
            days,
            campaigns: [],
            totalConcentration: {
              countries: [],
              regions: []
            }
          };
        }

        // Get all shareholders for these campaigns
        const campaignsWithShareholders = await this.prisma.campaign.findMany({
          where: {
            id: {
              in: activeCampaigns.map(c => c.id)
            }
          },
          include: {
            shareHolders: {
              select: {
                id: true,
                country: true,
                region: true,
              }
            }
          }
        });

        // Overall counts for all campaigns
        const totalShareholdersAll = campaignsWithShareholders.reduce(
          (sum, campaign) => sum + campaign.shareHolders.length, 0
        );
        
        const allCountryMap = new Map<string, number>();
        const allRegionMap = new Map<string, number>();
        
        // Process data for each campaign
        const campaignResults = campaignsWithShareholders.map(campaignData => {
          const { id, title, shareHolders } = campaignData;
          
          if (!shareHolders.length) {
            return {
              id,
              title,
              concentration: {
                countries: [],
                regions: []
              }
            };
          }

          const totalShareholders = shareHolders.length;
          const countryMap = new Map<string, number>();
          const regionMap = new Map<string, number>();

          // Process shareholders for this campaign
          shareHolders.forEach(shareholder => {
            // Skip if region filter is applied and this shareholder's region doesn't match
            if (region && shareholder.region !== region) {
              return;
            }

            // Update country count for this campaign
            const countryCount = countryMap.get(shareholder.country) || 0;
            countryMap.set(shareholder.country, countryCount + 1);

            // Update region count for this campaign
            const regionCount = regionMap.get(shareholder.region) || 0;
            regionMap.set(shareholder.region, regionCount + 1);

            // Update overall counts
            const allCountryCount = allCountryMap.get(shareholder.country) || 0;
            allCountryMap.set(shareholder.country, allCountryCount + 1);

            const allRegionCount = allRegionMap.get(shareholder.region) || 0;
            allRegionMap.set(shareholder.region, allRegionCount + 1);
          });

          // Calculate percentages for countries
          const countries = Array.from(countryMap.entries()).map(([country, count]) => {
            return {
              name: country,
              shareholderCount: count,
              percentage: Math.round((count / totalShareholders) * 100)
            };
          });

          // Sort countries by percentage in descending order
          countries.sort((a, b) => b.percentage - a.percentage);

          // Calculate percentages for regions
          const regions = Array.from(regionMap.entries()).map(([regionName, count]) => {
            return {
              name: regionName,
              shareholderCount: count,
              percentage: Math.round((count / totalShareholders) * 100)
            };
          });

          // Sort regions by percentage in descending order
          regions.sort((a, b) => b.percentage - a.percentage);

          return {
            id,
            title,
            concentration: {
              countries,
              regions
            }
          };
        });

        // Calculate overall percentages across all campaigns
        const allCountries = Array.from(allCountryMap.entries()).map(([country, count]) => {
          return {
            name: country,
            shareholderCount: count,
            percentage: Math.round((count / totalShareholdersAll) * 100)
          };
        });

        // Sort countries by percentage in descending order
        allCountries.sort((a, b) => b.percentage - a.percentage);

        // Calculate percentages for all regions
        const allRegions = Array.from(allRegionMap.entries()).map(([regionName, count]) => {
          return {
            name: regionName,
            shareholderCount: count,
            percentage: Math.round((count / totalShareholdersAll) * 100)
          };
        });

        // Sort regions by percentage in descending order
        allRegions.sort((a, b) => b.percentage - a.percentage);

        return {
          days,
          campaigns: campaignResults,
          totalConcentration: {
            countries: allCountries,
            regions: allRegions
          }
        };
      }

      // If we get here, a campaignId was provided - handle the single campaign case
      // Check if the campaign exists
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        select: {
          id: true,
          title: true,
        }
      });

      if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
      }

      // Get all shareholders for this campaign with their country and region information
      const campaignShareholders = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          shareHolders: {
            select: {
              id: true,
              country: true,
              region: true,
            }
          }
        }
      });

      if (!campaignShareholders || !campaignShareholders.shareHolders.length) {
        return {
          campaign: {
            id: campaign.id,
            title: campaign.title,
          },
          concentration: {
            countries: [],
            regions: []
          }
        };
      }

      // Calculate total number of shareholders
      const totalShareholders = campaignShareholders.shareHolders.length;

      // Group shareholders by country and calculate percentages
      const countryMap = new Map<string, number>();
      
      // Group shareholders by region (if region filter is applied, only include matching regions)
      const regionMap = new Map<string, number>();

      // Process shareholders to calculate concentrations
      campaignShareholders.shareHolders.forEach(shareholder => {
        // Skip if region filter is applied and this shareholder's region doesn't match
        if (region && shareholder.region !== region) {
          return;
        }

        // Update country count
        const countryCount = countryMap.get(shareholder.country) || 0;
        countryMap.set(shareholder.country, countryCount + 1);

        // Update region count
        const regionCount = regionMap.get(shareholder.region) || 0;
        regionMap.set(shareholder.region, regionCount + 1);
      });

      // Calculate percentages for countries
      const countries = Array.from(countryMap.entries()).map(([country, count]) => {
        return {
          name: country,
          shareholderCount: count,
          percentage: Math.round((count / totalShareholders) * 100)
        };
      });

      // Sort countries by percentage in descending order
      countries.sort((a, b) => b.percentage - a.percentage);

      // Calculate percentages for regions
      const regions = Array.from(regionMap.entries()).map(([regionName, count]) => {
        return {
          name: regionName,
          shareholderCount: count,
          percentage: Math.round((count / totalShareholders) * 100)
        };
      });

      // Sort regions by percentage in descending order
      regions.sort((a, b) => b.percentage - a.percentage);

      return {
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        concentration: {
          countries,
          regions
        }
      };
    } catch (error) {
      console.error('Error fetching shareholder regional concentration:', error);
      throw new Error(`Failed to fetch shareholder regional concentration: ${error.message}`);
    }
  }

  // findAll() {
  //   return this.prisma.campaignAnalytics.findMany({
  //     include: {
  //       CampaignClicks: true,
  //       campaign: true
  //     }
  //   });
  // }

  // findOne(id: string) {
  //   return this.prisma.campaignAnalytics.findUnique({
  //     where: { id },
  //     include: {
  //       CampaignClicks: true,
  //       campaign: true
  //     }
  //   });
  // }

  // async update(id: string, updateCampaignAnalyticDto: any) {
  //   return this.prisma.campaignAnalytics.update({
  //     where: { id },
  //     data: updateCampaignAnalyticDto
  //   });
  // }

  // async remove(id: string) {
  //   return this.prisma.campaignAnalytics.delete({
  //     where: { id }
  //   });
  // }
}
