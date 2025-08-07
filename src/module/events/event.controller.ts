import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EventStatus } from 'src/common/enum/event.enum';
import { Role } from 'src/common/enum/user-role.enum';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { EventDto } from '../events/dto/event.dto';
import { EventService } from './event.service';

@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('create')
  @Roles(Role.PROMOTER)
  async createEvent(@Body() body: EventDto) {
    return await this.eventService.createEvent(body);
  }

  @Get()
  async getEvent() {
    return await this.eventService.getEvent({
      eventStatus: EventStatus.APPROVED,
    });
  }

  @Post('like/:id')
  async likeEvent(@Param('id') id: string, @CurrentUser() user) {
    const result = await this.eventService.likeEvent(id, user.id);

    return {
      message: 'Event liked successfully',
      data: result,
    };
  }

  @Patch('approve-event/:id')
  async approveEvent(@Param('id') id: string) {
    const result = await this.eventService.approveEvent(id);

    return {
      data: result,
    };
  }

  @Patch('reject-event/:id')
  async rejectEvent(@Param('id') id: string) {
    const result = await this.eventService.rejectEvent(id);

    return {
      message: 'Event rejected successfully',
      data: result,
    };
  }
}
