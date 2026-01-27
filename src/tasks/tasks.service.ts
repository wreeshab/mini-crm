import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Role } from '../common/enums/role.enum';
import { TaskStatus } from './enums/task-status.enum';
import { TaskResponseDto } from './dto/task-response.dto';

interface RequestUser {
  id: string;
  role: Role;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private taskInclude = {
    assignedUser: { select: { id: true, name: true, email: true } },
    customer: { select: { id: true, name: true, email: true, phone: true } },
  };

  private mapToResponse(task: any): TaskResponseDto {
    return task as TaskResponseDto;
  }

  private async validateAssignee(assignedTo: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: assignedTo },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('Assigned user not found');
    }

    if (user.role !== Role.EMPLOYEE) {
      throw new BadRequestException('Assigned user must have EMPLOYEE role');
    }
  }

  private async validateCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  }

  async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
    await this.validateAssignee(dto.assignedTo);
    await this.validateCustomer(dto.customerId);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.PENDING,
        assignedTo: dto.assignedTo,
        customerId: dto.customerId,
      },
      include: this.taskInclude,
    });

    return this.mapToResponse(task);
  }

  async findAll(currentUser: RequestUser): Promise<TaskResponseDto[]> {
    const where =
      currentUser.role === Role.ADMIN
        ? {}
        : { assignedTo: currentUser.id };

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this.taskInclude,
    });

    return tasks.map((task) => this.mapToResponse(task));
  }

  private async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    currentUser: RequestUser,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskById(id);

    if (
      currentUser.role === Role.EMPLOYEE &&
      task.assignedTo !== currentUser.id
    ) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: { status: dto.status },
      include: this.taskInclude,
    });

    return this.mapToResponse(updated);
  }
}
