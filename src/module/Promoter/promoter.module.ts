import { Module } from '@nestjs/common';
import { EventModule } from '../events/event.module';
import { PromoterController } from './promoter.controller';
import { PromoterService } from './promoter.service';

@Module({
  imports: [EventModule],
  controllers: [PromoterController],
  providers: [PromoterService],
})
export class PromoterModule {}
