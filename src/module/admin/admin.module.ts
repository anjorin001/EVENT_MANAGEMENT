import { EventModule } from '../events/event.module';
import { UserModule } from '../users/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, EventModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
