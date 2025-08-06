import { Injectable } from '@nestjs/common';
import { EventDto } from '../events/dto/event.dto';
import { EventService } from './../events/event.service';

@Injectable()
export class PromoterService {
  constructor(private eventService: EventService) {}

  async createEvent(body: EventDto) {
    const event = this.eventService.createEvent(body);

    return {
      message: 'Event creation successfully',
      data: event,
    };
  }
}
