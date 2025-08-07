import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user-role.enum';
import { RolesGuard } from '../../common/guards/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
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

  @Get('/pending-events')
  async getPendingEvents() {
    return await this.adminService.getPendingEvents();
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
