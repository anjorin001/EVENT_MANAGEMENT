import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../events/event.module';
import { UserModule } from '../users/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule, UserModule, EventModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
