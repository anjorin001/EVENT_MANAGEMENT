import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user-role.enum';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('pending-users')
  async getPendingUsers() {
    return await this.adminService.getPendingUsers();
  }

  @Patch('approve-user/:id')
  async approveUser(@Param('id') id: string) {
    return await this.adminService.approveUser(id);
  }

  @Patch('reject-user/:id')
  async rejectUser(@Param('id') id: string) {
    return await this.adminService.rejectUser(id);
  }

  @Patch('approve-event/:id')
  async approveEvent(@Param('id') id: string) {
    return await this.adminService.approveEvent(id);
  }

  @Patch('reject-event/:id')
  async rejectEvent(@Param('id') id: string) {
    return await this.adminService.rejectEvent(id);
  }
}
