/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from './schema/event.schema';
import { Attendance, AttendanceSchema } from './schema/attendance.event';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{name: Attendance.name, schema: AttendanceSchema}])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
