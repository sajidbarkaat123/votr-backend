import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CampaignsModule } from 'src/campaigns/campaigns.module';

@Module({
  imports: [SharedModule, CampaignsModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService]
})
export class InvoiceModule { } 