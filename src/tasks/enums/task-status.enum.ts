import { TaskStatus as PrismaTaskStatus } from '@prisma/client';

// Single source of truth for task statuses (mirrors Prisma enum)
export const TaskStatus = PrismaTaskStatus;
export type TaskStatus = PrismaTaskStatus;
