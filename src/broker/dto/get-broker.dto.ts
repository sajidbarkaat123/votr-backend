import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetBrokerDto extends PaginationDto {
  @ApiProperty({
    description: 'Search term for broker name or email',
    example: 'john',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;
} 