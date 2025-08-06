import { Controller, Param, Patch } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/enum/user-role.enum';
import { AdminService } from './admin.service';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

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
