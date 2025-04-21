import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ShareHolderModule } from './share-holder/share-holder.module';
import { BrokerModule } from './broker/broker.module';
import { CompanyModule } from './company/company.module';
import { RangeModule } from './range/range.module';
import { CampaignAnalyticsModule } from './campaign-analytics/campaign-analytics.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    SharedModule, 
    UserModule, 
    AuthModule, 
    CampaignsModule, 
    ShareHolderModule, 
    BrokerModule, 
    CompanyModule, 
    RangeModule, 
    CampaignAnalyticsModule, 
    DashboardModule,
    InvoiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
