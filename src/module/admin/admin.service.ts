import { Injectable } from '@nestjs/common';
import { EventStatus } from 'src/common/enum/event.enum';
import { EventService } from '../events/event.service';
import { UserService } from '../users/user.service';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private eventService: EventService,
  ) {}

  async getPendingUsers() {
    const users = await this.userService.getPendingUsers();

    if (!users) {
      return {
        message: 'Zero users want the promoter role',
        data: null,
      };
    }

    return {
      message: 'Users who want promoter role retrieved successfully',
      data: users,
    };
  }

  async getPendingEvents() {
    return await this.eventService.getEvent({
      eventStatus: EventStatus.PENDING,
    });
  }

  async approveUser(id: string) {
    const approveduser = await this.userService.approveUser(id);

    return {
      message: 'user approved successfully',
      data: approveduser,
    };
  }

  async rejectUser(id: string) {
    const rejectUser = await this.userService.rejectUser(id);

    return {
      message: 'user rejected successfully',
      data: rejectUser,
    };
  }

  async approveEvent(id: string) {
    const event = await this.eventService.approveEvent(id);

    return {
      message: 'Event approved successfully',
      event: event,
    };
  }

  async rejectEvent(id: string) {
    const event = await this.eventService.rejectEvent(id);

    return {
      message: 'Event rejected successfully',
      event: event,
    };
  }
}
