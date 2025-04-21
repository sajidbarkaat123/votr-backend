import { IsOptional, IsString, IsEnum, IsNumber, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from 'src/common/all.enum';

export class GetShareHolderDto {
    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d+-\d+$/, { message: 'Age must be in the format "number-number"' })
    age: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d+-\d+$/, { message: 'Income must be in the format "number-number"' })
    income: string;

    @IsOptional()
    @IsEnum(GENDER)
    gender?: GENDER;



    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stockMinLimit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stockMaxLimit?: number;
}
