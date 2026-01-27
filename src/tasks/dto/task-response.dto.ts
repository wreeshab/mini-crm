import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskAssigneeDto {
  @ApiProperty({ description: 'User id', example: 'user-id-123' })
  id: string;

  @ApiProperty({ description: 'User name', example: 'Jane Employee' })
  name: string;

  @ApiProperty({ description: 'User email', example: 'jane@example.com' })
  email: string;
}

export class TaskCustomerDto {
  @ApiProperty({ description: 'Customer id', example: 'customer-id-123' })
  id: string;

  @ApiProperty({ description: 'Customer name', example: 'Acme Corp Contact' })
  name: string;

  @ApiProperty({ description: 'Customer email', example: 'contact@acme.com' })
  email: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890' })
  phone: string;
}

export class TaskResponseDto {
  @ApiProperty({ description: 'Task id', example: 'task-id-123' })
  id: string;

  @ApiProperty({ description: 'Task title', example: 'Follow up call' })
  title: string;

  @ApiProperty({ description: 'Task description', example: 'Call customer for onboarding', nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, description: 'Task status', example: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ description: 'Assigned user id', example: 'user-id-123' })
  assignedTo: string;

  @ApiProperty({ description: 'Customer id', example: 'customer-id-123' })
  customerId: string;

  @ApiProperty({ description: 'Created timestamp', example: '2026-01-27T17:45:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', example: '2026-01-27T17:45:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Assigned employee details', type: TaskAssigneeDto })
  assignedUser: TaskAssigneeDto;

  @ApiProperty({ description: 'Customer details', type: TaskCustomerDto })
  customer: TaskCustomerDto;
}
