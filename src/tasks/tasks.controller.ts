import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
export class TasksController {
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ];
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrator')
  @Get('admin')
  getAdminTasks() {
    return [{ id: 99, title: 'Admin Task', completed: false }];
  }
}
