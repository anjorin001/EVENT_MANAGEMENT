import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user-role.enum';
import { EventDto } from '../events/dto/event.dto';
import { PromoterService } from './promoter.service';

@UseGuards(AuthGuard('jwt'))
@Roles(Role.PROMOTER)
@Controller('promoter')
export class PromoterController {
  constructor(private promoterService: PromoterService) {}

  @Post('event')
  async creatEvent(@Body() body: EventDto) {
    return await this.promoterService.createEvent(body);
  }
}
