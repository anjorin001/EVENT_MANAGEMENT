/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from './schema/event.schema';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService, MongooseModule],
})
export class EventModule {}
