import { IsString, IsNotEmpty, IsEmail, IsInt, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '../../common/all.enum';

export class CreateShareHolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  age: number;

  @IsEnum(GENDER)
  gender: GENDER;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  income: number;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsOptional()
  campaignId: string;
}
