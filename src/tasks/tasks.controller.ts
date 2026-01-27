import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create task',
    description: 'Create a task linked to a customer and assigned to an employee. Admin only.',
  })
  @ApiCreatedResponse({ description: 'Task created successfully', type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Assigned user or customer not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Requires admin role' })
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'List tasks',
    description: 'Admins see all tasks. Employees see only tasks assigned to them.',
  })
  @ApiResponse({ status: 200, description: 'Tasks retrieved', type: [TaskResponseDto] })
  async findAll(@CurrentUser() user: any): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll({ id: user.sub ?? user.id, role: user.role });
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Update task status',
    description: 'Employees can update only their own tasks. Admins can update any task.',
  })
  @ApiResponse({ status: 200, description: 'Task status updated', type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Employees cannot update tasks assigned to others' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateStatus(
      id,
      dto,
      { id: user.sub ?? user.id, role: user.role },
    );
  }
}
