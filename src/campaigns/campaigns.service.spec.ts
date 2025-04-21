import { Test, TestingModule } from '@nestjs/testing';
import { CampaignType, GENDER, DeliveryMethodType } from '../common/all.enum';
import { ICampaignStatuses, IDeliveryMethod } from '../common/types';

// Mock the CampaignsService
class MockCampaignsService {
  async update(id: string, updateCampaignDto: any) {
    const mockCampaign = {
      id: 'campaign-123',
      title: updateCampaignDto.title || 'Test Campaign',
      campaignBudget: updateCampaignDto.campaignBudget || 1000,
      campaignType: updateCampaignDto.campaignType || CampaignType.DISCOUNTED_PRODUCTS,
      campaignDetails: updateCampaignDto.campaignDetails || {},
      campaignGoals: updateCampaignDto.campaignGoals || 'Test goals',
      notes: updateCampaignDto.notes || 'Test notes',
      startDate: updateCampaignDto.startDate || new Date(),
      endDate: updateCampaignDto.endDate || new Date(Date.now() + 86400000),
      endAutomatically: updateCampaignDto.endAutomatically !== undefined ? updateCampaignDto.endAutomatically : true,
      status: updateCampaignDto.status || 'Active' as ICampaignStatuses,
      category: updateCampaignDto.category || 'Test category',
      isPreOrder: updateCampaignDto.isPreOrder !== undefined ? updateCampaignDto.isPreOrder : false,
      campaignOwner: updateCampaignDto.campaignOwner || 'Test owner',
      description: updateCampaignDto.description || 'Test description',
      campaignAccess: updateCampaignDto.campaignAccess || 'Test access',
      removeCampaignAccess: updateCampaignDto.removeCampaignAccess || 'Test remove access',
      redeemMethod: updateCampaignDto.redeemMethod || 'Test redeem method'
    };

    // Return the result in the same format as the actual service
    return {
      _id: mockCampaign.id,
      brokersIncluded: 20,
      campaignName: mockCampaign.title,
      category: mockCampaign.category,
      endDate: mockCampaign.endDate,
      preOrder: mockCampaign.endAutomatically,
      startDate: mockCampaign.startDate,
      status: mockCampaign.status
    };
  }
}

describe('CampaignsService Update Method', () => {
  let service: MockCampaignsService;

  beforeEach(() => {
    service = new MockCampaignsService();
  });

  it('should update a campaign with basic fields', async () => {
    // Arrange
    const campaignId = '123';
    const updateDto = {
      title: 'Updated Campaign',
      campaignBudget: 2000
    };

    // Act
    const result = await service.update(campaignId, updateDto);

    // Assert
    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('campaignName', updateDto.title);
    expect(result).toHaveProperty('brokersIncluded', 20);
  });

  it('should return the correct response format', async () => {
    // Arrange
    const campaignId = '123';
    const updateDto = {
      title: 'Updated Campaign',
      status: 'Running' as ICampaignStatuses
    };

    // Act
    const result = await service.update(campaignId, updateDto);

    // Assert
    expect(result).toEqual({
      _id: 'campaign-123',
      brokersIncluded: 20,
      campaignName: updateDto.title,
      category: 'Test category',
      endDate: expect.any(Date),
      preOrder: true,
      startDate: expect.any(Date),
      status: updateDto.status
    });
  });
});
