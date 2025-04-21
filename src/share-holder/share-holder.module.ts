import { Module } from '@nestjs/common';
import { ShareHolderService } from './share-holder.service';
import { ShareHolderController } from './share-holder.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TargetShareHolderService } from './target-share-holder.service';

@Module({
  imports:[SharedModule],
  controllers: [ShareHolderController],
  providers: [ShareHolderService,TargetShareHolderService],
  exports: [ShareHolderService,TargetShareHolderService]
})
export class ShareHolderModule {}
