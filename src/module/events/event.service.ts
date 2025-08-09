/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStatus } from 'src/common/enum/event.enum';
import { UserService } from '../users/user.service';
import { EventFilterDto } from './dto/event-status.dto';
import { EventDto } from './dto/event.dto';
import { Attendance, AttendanceDocument } from './schema/attendance.event';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Attendance.name)
    private attendaceModel: Model<AttendanceDocument>,
    private userService: UserService,
  ) {}

  async createEvent(data: EventDto) {
    const event = await this.eventModel.create({
      eventStatus: EventStatus.PENDING,
      ...data,
    });

    return event;
  }

  async getEvent(filterDto: EventFilterDto) {
    const filter: any = {};

    if (filterDto?.eventStatus) {
      filter.eventStatus = filterDto.eventStatus;
    }

    const events = await this.eventModel.find(filter);
    return { message: 'Events fetched successfully', data: events };
  }

  async likeEvent(eventId: string, userId: string) {
    const isRegistered = await this.attendaceModel.findOne({ userId, eventId });
    if (isRegistered) throw new ConflictException('you can only register once');

    const event = await this.eventModel.findById(eventId);
    if (event?.availableSeats === 0)
      throw new ConflictException('seat availabilty is zero');
    if (!event) throw new NotFoundException('event not found');
    
    const eventUpdate = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { availableSeats: -1 } },
      { new: true },
    );

    const userUpdate = await this.userService.addEventToUser(eventId, userId);
    await this.attendaceModel.create({
      eventId,
      userId,
    });

    return { event: eventUpdate, user: userUpdate };
  }

  async approveEvent(id: string) {
    const event = await this.eventModel.findOneAndUpdate(
      { _id: id, eventStatus: EventStatus.PENDING },
      { eventStatus: EventStatus.APPROVED },
      { new: true },
    );

    if (!event) throw new NotFoundException('event not found');
    return event;
  }

  async rejectEvent(id: string) {
    const event = await this.eventModel.findOneAndUpdate(
      { _id: id, eventStatus: EventStatus.PENDING },
      { eventStatus: EventStatus.REJECTED },
      { new: true },
    );

    if (!event) throw new NotFoundException('event not found');
    return event;
  }
}
