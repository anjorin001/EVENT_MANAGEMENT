import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) { }
  
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    console.log(user)
    return await this.userService.findById(user.id);
  }
}
