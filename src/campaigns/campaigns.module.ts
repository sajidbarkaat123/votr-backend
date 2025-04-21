import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ShareHolderModule } from 'src/share-holder/share-holder.module';

@Module({
  imports: [SharedModule,ShareHolderModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule { }
