import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EventStatus } from 'src/common/enum/event.enum';
import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';

@UseGuards(AuthGuard('jwt'))
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Roles('PROMOTER')
  @Post('create')
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
    const result = await this.eventService.likeEvent(id, user._id);

    return {
      message: 'Event liked successfully',
      data: result,
    };
  }
}
