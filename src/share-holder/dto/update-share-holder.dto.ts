import { PartialType } from '@nestjs/mapped-types';
import { CreateShareHolderDto } from './create-share-holder.dto';

export class UpdateShareHolderDto extends PartialType(CreateShareHolderDto) {}
