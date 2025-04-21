import { Module } from '@nestjs/common';
import { RangeService } from './range.service';
import { RangeController } from './range.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RangeController],
  providers: [RangeService],
})
export class RangeModule { }
