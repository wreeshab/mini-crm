import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { PaginatedCustomersResponseDto } from './dto/paginated-customers-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing JWT token',
})
@ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Create a new customer record. Only accessible by admins.',
  })
  @ApiCreatedResponse({
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiConflictResponse({
    description: 'Customer with this email or phone already exists',
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Get all customers with pagination and search',
    description:
      'Retrieve a paginated list of customers with optional search filtering. ' +
      'Search is performed across name, email, phone, and company fields (case-insensitive). ' +
      'Leave search empty or omit it to return all customers. ' +
      'Accessible by admins and employees.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1, min: 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page (default: 10, min: 1, max: 100)',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Optional search term. Filters customers by name, email, phone, or company. Case-insensitive partial match. Leave empty to fetch all customers.',
    example: 'acme',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of customers retrieved successfully',
    type: PaginatedCustomersResponseDto,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<PaginatedCustomersResponseDto> {
    return this.customersService.findAll(page, limit, search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Get customer by ID',
    description:
      'Retrieve a specific customer by their ID. Accessible by admins and employees.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: 'cmkwuj8dr00039gkz6kt3jnxf',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer found and returned successfully',
    type: CustomerResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update customer details',
    description:
      'Update customer information (name, email, phone, company). Only accessible by admins.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID to update',
    example: 'cmkwuj8dr00039gkz6kt3jnxf',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiConflictResponse({
    description: 'Customer with this email or phone already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete customer',
    description:
      'Delete a customer by their ID. Only accessible by admins.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID to delete',
    example: 'cmkwuj8dr00039gkz6kt3jnxf',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
    type: CustomerResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async remove(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.customersService.remove(id);
  }
}
