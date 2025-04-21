import { Injectable } from '@nestjs/common';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { GetBrokerDto } from './dto/get-broker.dto';
import { Prisma } from '@prisma/client';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { MetricDto } from './dto/metric.dto';

@Injectable()
export class BrokerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrokerDto: CreateBrokerDto) {
    return this.prisma.brooker.create({
      data: createBrokerDto,
    });
  }

  async findAll(getBrokerDto: GetBrokerDto) {
    const { skip, take, search } = getBrokerDto;
    
    // Create a filter based on search term if provided
    const where: Prisma.BrookerWhereInput = search
      ? {
          OR: [
            { 
              name: { 
                contains: search, 
                mode: Prisma.QueryMode.insensitive 
              } 
            },
            { 
              email: { 
                contains: search, 
                mode: Prisma.QueryMode.insensitive 
              } 
            },
          ],
        }
      : {};
    
    // Get all brokers with pagination and search filter
    const brokers = await this.prisma.brooker.findMany({
      where,
      skip,
      take,
    });
    
    // Get total count for pagination metadata with the same filter
    const totalBrokers = await this.prisma.brooker.count({
      where,
    });
    
    // Get enhanced data for each broker
    const enhancedBrokers = await Promise.all(
      brokers.map(async (broker) => {
        // Get number of shares for this broker
        const sharesData = await this.prisma.shares.aggregate({
          where: {
            brookerId: broker.id,
          },
          _count: true,
        });
        
        // Get count of unique shareholders for this broker
        const uniqueShareHolders = await this.prisma.shares.findMany({
          where: {
            brookerId: broker.id,
          },
          select: {
            shareHolderId: true,
          },
          distinct: ['shareHolderId'],
        });
        
        // Get campaign claims by this broker
        const campaignClaims = await this.prisma.campaignRewardClaim.findMany({
          where: {
            brokerId: broker.id,
          },
          select: {
            campaignId: true,
          },
          distinct: ['campaignId'],
        });
        
        // Get unique campaign IDs
        const campaignIds = campaignClaims.map(claim => claim.campaignId);
        
        // Get campaign statuses for counting active campaigns
        const campaigns = await this.prisma.campaign.findMany({
          where: {
            id: {
              in: campaignIds,
            },
          },
          select: {
            id: true,
            status: true,
          },
        });
        
        // Count active campaigns
        const activeCampaigns = campaigns.filter(campaign => campaign.status === 'ACTIVE').length;
        
        return {
          ...broker,
          sharesCount: sharesData._count,
          sharesRecords: sharesData._count,
          shareholdersCount: uniqueShareHolders.length,
          activeCampaigns,
          totalCampaigns: campaignIds.length,
        };
      })
    );
    
    return {
      data: enhancedBrokers,
      meta: {
        totalItems: totalBrokers,
        itemCount: enhancedBrokers.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalBrokers / take),
        currentPage: Math.floor(skip / take) + 1,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.brooker.findUnique({
      where: { id },
      include: {
        userShares: true,
        CampaignRewardClaim: true,
      },
    });
  }

  async update(id: string, updateBrokerDto: UpdateBrokerDto) {
    return this.prisma.brooker.update({
      where: { id },
      data: updateBrokerDto,
    });
  }

  async remove(id: string) {
    // The Brooker model doesn't have a deleted field, so we'll use hard delete
    return this.prisma.brooker.delete({
      where: { id },
    });
  }

  /**
   * Gets total shares owned metric with change from previous month
   */
  async getTotalSharesOwned(): Promise<MetricDto> {
    try {
      // Get total shares owned (total number of share records)
      const sharesData = await this.prisma.shares.aggregate({
        _count: true
      });

      // Get last month's data for comparison
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Shares one month ago
      const lastMonthSharesData = await this.prisma.shares.aggregate({
        where: {
          createdAt: {
            lt: oneMonthAgo
          }
        },
        _count: true
      });

      // Calculate changes from last month
      const totalSharesChange = sharesData._count - lastMonthSharesData._count;

      // Format the values for dashboard display
      const formatLargeNumber = (num: number) => {
        if (num >= 1_000_000_000) {
          return (num / 1_000_000_000).toFixed(2) + 'B';
        } else if (num >= 1_000_000) {
          return (num / 1_000_000).toFixed(2) + 'M';
        } else if (num >= 1_000) {
          return (num / 1_000).toFixed(1) + 'K';
        }
        return num.toString();
      };

      return {
        value: formatLargeNumber(sharesData._count),
        rawValue: sharesData._count,
        change: formatLargeNumber(totalSharesChange),
        rawChange: totalSharesChange,
        increaseType: (totalSharesChange >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease'
      };
    } catch (error) {
      console.error('Error fetching total shares owned metric:', error);
      throw new Error('Failed to fetch total shares owned metric');
    }
  }

  /**
   * Gets total shareholders metric with change from previous month
   */
  async getTotalShareholders(): Promise<MetricDto> {
    try {
      // Get total shareholders (unique shareholders)
      const totalShareholders = await this.prisma.shareHolder.count({
        where: {
          deleted: false
        }
      });

      // Get last month's data for comparison
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Shareholders one month ago
      const lastMonthShareholders = await this.prisma.shareHolder.count({
        where: {
          deleted: false,
          createdAt: {
            lt: oneMonthAgo
          }
        }
      });

      // Calculate changes from last month
      const totalShareholdersChange = totalShareholders - lastMonthShareholders;

      // Format the values for dashboard display
      const formatLargeNumber = (num: number) => {
        if (num >= 1_000_000_000) {
          return (num / 1_000_000_000).toFixed(2) + 'B';
        } else if (num >= 1_000_000) {
          return (num / 1_000_000).toFixed(2) + 'M';
        } else if (num >= 1_000) {
          return (num / 1_000).toFixed(1) + 'K';
        }
        return num.toString();
      };

      return {
        value: formatLargeNumber(totalShareholders),
        rawValue: totalShareholders,
        change: formatLargeNumber(totalShareholdersChange),
        rawChange: totalShareholdersChange,
        increaseType: (totalShareholdersChange >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease'
      };
    } catch (error) {
      console.error('Error fetching total shareholders metric:', error);
      throw new Error('Failed to fetch total shareholders metric');
    }
  }

  /**
   * Gets average share price metric with change from previous month
   */
  async getAvgSharePrice(): Promise<MetricDto> {
    try {
      // Get average share price
      const sharesData = await this.prisma.shares.aggregate({
        _avg: {
          price: true
        }
      });

      // Get last month's data for comparison
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Average price one month ago
      const lastMonthSharesData = await this.prisma.shares.aggregate({
        where: {
          createdAt: {
            lt: oneMonthAgo
          }
        },
        _avg: {
          price: true
        }
      });

      // Calculate changes from last month
      const avgPriceChange = (sharesData._avg.price || 0) - (lastMonthSharesData._avg.price || 0);

      // Format currency values
      const formatCurrency = (num: number) => {
        if (num >= 1_000_000) {
          return '$' + (num / 1_000).toFixed(1) + 'K';
        } else if (num >= 1_000) {
          return '$' + (num / 1_000).toFixed(1) + 'K';
        }
        return '$' + num.toFixed(2);
      };

      return {
        value: formatCurrency(sharesData._avg.price || 0),
        rawValue: sharesData._avg.price || 0,
        change: formatCurrency(avgPriceChange),
        rawChange: avgPriceChange,
        increaseType: (avgPriceChange >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease'
      };
    } catch (error) {
      console.error('Error fetching average share price metric:', error);
      throw new Error('Failed to fetch average share price metric');
    }
  }

  /**
   * Gets average share price metric with shareholders change for the fourth card
   */
  async getAvgSharePriceRepeat(): Promise<MetricDto> {
    try {
      // Get both the average price and shareholders data
      const [avgSharePrice, totalShareholders] = await Promise.all([
        this.getAvgSharePrice(),
        this.getTotalShareholders()
      ]);
      
      // Return avg share price value with shareholders change
      return {
        ...avgSharePrice,
        change: totalShareholders.change,
        rawChange: totalShareholders.rawChange,
        increaseType: totalShareholders.increaseType
      };
    } catch (error) {
      console.error('Error fetching duplicate average share price metric:', error);
      throw new Error('Failed to fetch duplicate average share price metric');
    }
  }

  /**
   * Gets dashboard metrics for brokers including:
   * - Total Shares Owned
   * - Total Shareholders
   * - Average Share Price
   * - Monthly changes in metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    try {
      // Get all metrics in parallel for better performance
      const [totalSharesOwned, totalShareholders, avgSharePrice, avgSharePriceRepeat] = await Promise.all([
        this.getTotalSharesOwned(),
        this.getTotalShareholders(),
        this.getAvgSharePrice(),
        this.getAvgSharePriceRepeat()
      ]);

      // Return a complete dashboard metrics object
      return {
        totalSharesOwned,
        totalShareholders,
        avgSharePrice,
        avgSharePriceRepeat
      };
    } catch (error) {
      console.error('Error fetching broker dashboard metrics:', error);
      throw new Error('Failed to fetch broker dashboard metrics');
    }
  }
}
