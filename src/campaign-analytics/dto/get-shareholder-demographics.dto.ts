import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgeGroupFilter, ShareholderConcentrationLevel } from '../../common/all.enum';

export class GetShareholderDemographicsDto {
  @ApiProperty({
    description: 'The unique identifier of the campaign',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsUUID()
  campaignId: string;

  @ApiProperty({
    description: 'Filter by age group',
    enum: AgeGroupFilter,
    default: AgeGroupFilter.ALL,
    required: false
  })
  @IsOptional()
  @IsEnum(AgeGroupFilter)
  ageGroup?: AgeGroupFilter = AgeGroupFilter.ALL;
} 