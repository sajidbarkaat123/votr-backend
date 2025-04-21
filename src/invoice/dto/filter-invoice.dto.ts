import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterInvoiceDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter invoices by status',
    enum: ['PENDING', 'PAID', 'CANCELLED', 'OVERDUE', 'DUE'],
    required: false
  })
  status?: string;
} 