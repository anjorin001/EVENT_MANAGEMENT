/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStatus } from 'src/common/enum/event.enum';
import { UserService } from '../users/user.service';
import { EventFilterDto } from './dto/event-status.dto';
import { EventDto } from './dto/event.dto';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
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
    const eventUpdate = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { availableSeats: -1 } },
      { new: true },
    );

    if (!eventUpdate) throw new NotFoundException('event not found');

    const userUpdate = await this.userService.addEventToUser(eventId, userId);

    return { event: eventUpdate, user: userUpdate };
  }

  async approveEvent(id: string) {
    const event = await this.eventModel.findByIdAndUpdate(
      id,
      { eventStatus: EventStatus.APPROVED },
      { new: true },
    );

    if (!event) throw new NotFoundException('event not found');
    return event;
  }

  async rejectEvent(id: string) {
    const event = await this.eventModel.findByIdAndUpdate(
      id,
      { eventStatus: EventStatus.REJECTED },
      { new: true },
    );

    if (!event) throw new NotFoundException('event not found');
    return event;
  }
}
