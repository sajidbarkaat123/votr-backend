import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
    default: 10
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Calculate the number of records to skip based on page and limit
   */
  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * Get the limit value (alias for take)
   */
  get take(): number {
    return this.limit;
  }
} 