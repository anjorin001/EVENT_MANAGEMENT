import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../events/event.module';
import { PromoterController } from './promoter.controller';
import { PromoterService } from './promoter.service';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [PromoterController],
  providers: [PromoterService],
})
export class PromoterModule {}
