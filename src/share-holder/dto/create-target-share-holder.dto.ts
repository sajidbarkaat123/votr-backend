import { IsArray, IsInt, IsNumber, IsString, ArrayNotEmpty, Min, IsEnum, IsOptional, IsNotEmpty, IsObject } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { GENDER } from 'src/common/all.enum';
import { InputJsonValue } from '@prisma/client/runtime/library';

export class CreateTargetShareHolderDto {
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  region: string[];  //done

  @IsString()
  age: string;  //done

  @IsEnum(GENDER)
  gender: GENDER; //done

  @IsString()
  income:string //done

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  minstockOwnerShipStake: number;  //done

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  maxstockOwnerShipStake: number; //done

  @IsObject()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  @IsOptional()
  stockOwninBetween:Record<string, any>

  @IsString()
  @IsOptional()
  campaignId: string;
}
