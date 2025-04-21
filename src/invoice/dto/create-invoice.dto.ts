import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerBreakdownDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Broker ID' })
  brokerId: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Reach cost for this broker', default: 0 })
  reachCost: number = 0;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Engagement fee for this broker', default: 0 })
  engagementFee: number = 0;
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Notification cost' })
  notificationCost: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Miscellaneous cost' })
  micillenousCost: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Campaign ID' })
  campaignId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Notes for the invoice', required: false })
  notes?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Invoice status', 
    default: 'PENDING', 
    enum: ['PENDING', 'PAID', 'CANCELLED', 'OVERDUE', 'DUE'],
    required: false 
  })
  status?: string = 'PENDING';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'Audience cost', default: 0, required: false })
  audienceCost?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'Reach cost', default: 0, required: false })
  reachCost?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'Tax rate percentage', default: 0.05, required: false })
  taxRate?: number = 0.05;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'Campaign transaction cost', default: 0, required: false })
  campaignTransactionCost?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'BOGO discount amount', default: 0, required: false })
  bogoDiscount?: number = 0;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrokerBreakdownDto)
  @ApiProperty({ type: [BrokerBreakdownDto], description: 'Broker breakdowns', required: false })
  brokerBreakdowns?: BrokerBreakdownDto[] = [];
} 