import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  imports: [SharedModule],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
