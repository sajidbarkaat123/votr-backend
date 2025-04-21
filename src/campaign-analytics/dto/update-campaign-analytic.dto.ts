import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignAnalyticDto } from './create-campaign-analytic.dto';

export class UpdateCampaignAnalyticDto extends PartialType(CreateCampaignAnalyticDto) {}
