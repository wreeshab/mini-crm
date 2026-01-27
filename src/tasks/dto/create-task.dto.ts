import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Follow up call' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Task description', example: 'Call the customer to confirm details' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Employee user id to assign', example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty({ description: 'Customer id to link task to', example: 'customer-id-123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Task status', example: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
