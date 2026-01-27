import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  const prisma: any = {
    customer: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const service = new CustomersService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates customer', async () => {
    prisma.customer.create.mockResolvedValue({ id: '1', name: 'A' });
    const result = await service.create({
      name: 'A',
      email: 'a@test.com',
      phone: '+1',
      company: 'Co',
    } as any);
    expect(result).toEqual({ id: '1', name: 'A' });
  });

  it('throws conflict on duplicate', async () => {
    prisma.customer.create.mockRejectedValue({ code: 'P2002', meta: { target: ['email'] } });
    await expect(
      service.create({ name: 'A', email: 'a@test.com', phone: '+1' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('paginates with clamped page/limit and search', async () => {
    prisma.customer.count.mockResolvedValue(1);
    prisma.customer.findMany.mockResolvedValue([{ id: '1' }]);

    const result = await service.findAll(1000, 5000, 'john');

    expect(prisma.customer.count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        OR: expect.any(Array),
      }),
    });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(100);
    expect(result.totalRecords).toBe(1);
    expect(result.data).toEqual([{ id: '1' }]);
  });

  it('findOne throws when missing', async () => {
    prisma.customer.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update throws conflict on duplicate', async () => {
    prisma.customer.update.mockRejectedValue({ code: 'P2002', meta: { target: ['phone'] } });
    await expect(service.update('1', { phone: 'x' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('remove throws when missing', async () => {
    prisma.customer.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.remove('1')).rejects.toBeInstanceOf(NotFoundException);
  });
});
