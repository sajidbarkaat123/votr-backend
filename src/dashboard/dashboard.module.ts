import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ShareHolderModule } from 'src/share-holder/share-holder.module';

@Module({
  imports: [
    SharedModule,
    ShareHolderModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 