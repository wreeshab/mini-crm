import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    description: 'User role - must be either ADMIN or EMPLOYEE',
    example: 'EMPLOYEE',
    enumName: 'Role',
  })
  @IsEnum(Role, { message: 'role must be either ADMIN or EMPLOYEE' })
  role: Role;
}
