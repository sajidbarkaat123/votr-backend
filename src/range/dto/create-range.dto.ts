import { IsEnum, IsNotEmpty, IsSemVer, IsString } from "class-validator";
import { rangeType } from "src/common/all.enum";

export class CreateRangeDto {
    @IsEnum(rangeType)
    type:rangeType

    @IsNotEmpty()
    @IsString()
    range:string
}
