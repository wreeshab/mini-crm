import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginatedCustomersResponseDto } from './dto/paginated-customers-response.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.prisma.customer.create({
        data: createCustomerDto,
      });
    } catch (error) {
      // Prisma unique constraint violation error code
      if (error?.code === 'P2002') {
        const target = error?.meta?.target as string[];
        const field = target?.[0] || 'field';
        throw new ConflictException(
          `Customer with this ${field} already exists`,
        );
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedCustomersResponseDto> {
    // Normalize incoming pagination values
    const normalizedLimit = Math.min(Math.max(limit || 10, 1), 100);
    const normalizedPage = Math.max(page || 1, 1);

    const totalRecords = await this.prisma.customer.count();
    const totalPages = totalRecords === 0
      ? 0
      : Math.ceil(totalRecords / normalizedLimit);

    const currentPage = totalPages === 0
      ? 1
      : Math.min(normalizedPage, totalPages);

    const skip = totalPages === 0 ? 0 : (currentPage - 1) * normalizedLimit;

    const data = await this.prisma.customer.findMany({
      skip,
      take: normalizedLimit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      page: currentPage,
      limit: normalizedLimit,
      totalRecords,
      totalPages,
      data,
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
    } catch (error) {
      // Record not found
      if (error?.code === 'P2025') {
        throw new NotFoundException('Customer not found');
      }
      // Unique constraint violation
      if (error?.code === 'P2002') {
        const target = error?.meta?.target as string[];
        const field = target?.[0] || 'field';
        throw new ConflictException(
          `Customer with this ${field} already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Customer> {
    try {
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Customer not found');
      }
      throw error;
    }
  }
}
