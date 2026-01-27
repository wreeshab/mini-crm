import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './customer-response.dto';

export class PaginatedCustomersResponseDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of records',
    example: 50,
  })
  totalRecords: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Array of customers',
    type: [CustomerResponseDto],
  })
  data: CustomerResponseDto[];
}
