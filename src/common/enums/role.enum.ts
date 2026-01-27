import { Role as PrismaRole } from '@prisma/client';

// Single source of truth for user roles (mirrors Prisma enum)
export const Role = PrismaRole;
export type Role = PrismaRole;
