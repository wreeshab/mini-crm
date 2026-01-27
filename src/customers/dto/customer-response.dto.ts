import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'Customer unique identifier',
    example: 'cmkwuj8dr00039gkz6kt3jnxf',
  })
  id: string;

  @ApiProperty({
    description: 'Customer full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Customer company name',
    example: 'Acme Corp',
    nullable: true,
  })
  company: string | null;

  @ApiProperty({
    description: 'Customer creation timestamp',
    example: '2026-01-27T17:04:20.271Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Customer last update timestamp',
    example: '2026-01-27T17:04:20.271Z',
  })
  updatedAt: Date;
}
