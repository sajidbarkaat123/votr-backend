import { ApiProperty } from '@nestjs/swagger';
import { MetricDto } from './metric.dto';

export class DashboardMetricsDto {
  @ApiProperty({
    description: 'Total shares owned metrics',
    type: MetricDto
  })
  totalSharesOwned: MetricDto;

  @ApiProperty({
    description: 'Total shareholders metrics',
    type: MetricDto
  })
  totalShareholders: MetricDto;

  @ApiProperty({
    description: 'Average share price metrics',
    type: MetricDto
  })
  avgSharePrice: MetricDto;

  @ApiProperty({
    description: 'Duplicate of average share price metrics (for UI purposes)',
    type: MetricDto
  })
  avgSharePriceRepeat: MetricDto;
} 