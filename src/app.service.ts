import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Welcome to Mini CRM API',
      documentation: 'API documentation is available at /api/docs',
      endpoints: {
        docs: '/api/docs',
        auth: '/api/auth',
        users: '/api/users',
        customers: '/api/customers',
        tasks: '/api/tasks',
      },
    };
  }
}
