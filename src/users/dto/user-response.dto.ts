import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'cmkwuj8dr00039gkz6kt3jnxf',
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    enum: Role,
    description: 'User role',
    example: 'EMPLOYEE',
  })
  role: Role;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2026-01-27T17:04:20.271Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2026-01-27T17:04:20.271Z',
  })
  updatedAt: Date;
}
