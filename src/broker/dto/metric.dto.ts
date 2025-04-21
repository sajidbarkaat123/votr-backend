import { ApiProperty } from '@nestjs/swagger';

export class MetricDto {
  @ApiProperty({ example: '3.48B', description: 'Formatted value for display' })
  value: string;

  @ApiProperty({ example: 3480000000, description: 'Raw numerical value' })
  rawValue: number;

  @ApiProperty({ example: '3.9K', description: 'Formatted change from last month' })
  change: string;

  @ApiProperty({ example: 3900, description: 'Raw numerical change from last month' })
  rawChange: number;

  @ApiProperty({ example: 'increase', enum: ['increase', 'decrease'], description: 'Type of change' })
  increaseType: 'increase' | 'decrease';
} 