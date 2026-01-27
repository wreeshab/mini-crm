import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Role } from '../common/enums/role.enum';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksService', () => {
  const prisma: any = {
    user: { findUnique: jest.fn() },
    customer: { findUnique: jest.fn() },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const service = new TasksService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws if assignee not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.create({
        title: 't',
        assignedTo: 'u1',
        customerId: 'c1',
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws if assignee not employee', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', role: Role.ADMIN });
    prisma.customer.findUnique.mockResolvedValue({ id: 'c1' });
    await expect(
      service.create({ title: 't', assignedTo: 'u1', customerId: 'c1' } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates task when valid', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', role: Role.EMPLOYEE });
    prisma.customer.findUnique.mockResolvedValue({ id: 'c1' });
    prisma.task.create.mockResolvedValue({ id: 't1' });
    const result = await service.create({
      title: 't',
      assignedTo: 'u1',
      customerId: 'c1',
    } as any);
    expect(result).toEqual({ id: 't1' });
  });

  it('findAll filters for employees', async () => {
    prisma.task.findMany.mockResolvedValue([{ id: 't1', assignedTo: 'u1' }]);
    const res = await service.findAll({ id: 'u1', role: Role.EMPLOYEE });
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { assignedTo: 'u1' } }),
    );
    expect(res).toEqual([{ id: 't1', assignedTo: 'u1' }]);
  });

  it('updateStatus forbids other employee tasks', async () => {
    prisma.task.findUnique.mockResolvedValue({ id: 't1', assignedTo: 'u1' });
    await expect(
      service.updateStatus('t1', { status: TaskStatus.DONE } as any, {
        id: 'u2',
        role: Role.EMPLOYEE,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updateStatus updates when allowed', async () => {
    prisma.task.findUnique.mockResolvedValue({ id: 't1', assignedTo: 'u1' });
    prisma.task.update.mockResolvedValue({ id: 't1', status: TaskStatus.DONE });
    const res = await service.updateStatus(
      't1',
      { status: TaskStatus.DONE } as any,
      { id: 'u1', role: Role.EMPLOYEE },
    );
    expect(res).toEqual({ id: 't1', status: TaskStatus.DONE });
  });

  it('updateStatus throws 404 when missing', async () => {
    prisma.task.findUnique.mockResolvedValue(null);
    await expect(
      service.updateStatus('missing', { status: TaskStatus.DONE } as any, {
        id: 'u1',
        role: Role.ADMIN,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
