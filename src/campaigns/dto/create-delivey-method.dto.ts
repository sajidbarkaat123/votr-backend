import { IsEnum, IsInt, IsDateString, IsString, IsOptional } from 'class-validator';
import { DeliveryMethodType } from '../../common/all.enum';
import { Transform, Type } from 'class-transformer';

export class CreateDeliveryMethodDto {
    @IsEnum(DeliveryMethodType)
    type: DeliveryMethodType;

    @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
    @IsInt()
    maxCount: number;

    @IsString()
    preferedTime: string;

    @IsOptional()
    @IsString()
    campaignId?: string;
}


export class createManyDeliveryMethodDto {
    data: CreateDeliveryMethodDto[];
}


export class CreateDeliveryMethodReqDto {
    @IsEnum(DeliveryMethodType)
    type: DeliveryMethodType;

    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    maxCount: number;

    @IsDateString()
    preferedTime: string;

}

export class createManyDeliveryMethodReqDto {
    data: CreateDeliveryMethodReqDto[];
}