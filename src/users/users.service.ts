import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<SafeUser> {
    const user = await this.prisma.user.create({ data });
    return this.stripPassword(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.stripPassword(user) : null;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log("get all function was called.")
    return users.map((user) => this.stripPassword(user));
  }

  async updateUserRole(
    id: string,
    role: Prisma.UserUpdateInput['role'],
  ): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    return this.stripPassword(user);
  }

  stripPassword(user: User): SafeUser {
    const { password, ...rest } = user;
    return rest;
  }
}
