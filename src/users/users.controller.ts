import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing JWT token' })
@ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system. Only accessible by admins.',
  })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully', type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve detailed information about a specific user by their ID. Only accessible by admins.',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 'cmkwuj8dr00039gkz6kt3jnxf' })
  @ApiResponse({ status: 200, description: 'User found and returned successfully', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user role',
    description: 'Update the role of a specific user. Only the role field can be modified. Only accessible by admins.',
  })
  @ApiParam({ name: 'id', description: 'User ID to update', example: 'cmkwuj8dr00039gkz6kt3jnxf' })
  @ApiResponse({ status: 200, description: 'User role updated successfully', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateRole(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto): Promise<UserResponseDto> {
    try {
      return await this.usersService.updateUserRole(id, updateUserRoleDto.role);
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}

