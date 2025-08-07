import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enum/user-role.enum';
import { RolesGuard } from '../../common/guards/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventDto } from '../events/dto/event.dto';
import { PromoterService } from './promoter.service';

@Controller('promoter')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PROMOTER)
export class PromoterController {
  constructor(private promoterService: PromoterService) {}

  @Post('event')
  async creatEvent(@Body() body: EventDto) {
    return await this.promoterService.createEvent(body);
  }
}
