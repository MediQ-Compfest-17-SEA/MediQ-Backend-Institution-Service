import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns application information',
    schema: {
      type: 'object',
      properties: {
        service: { type: 'string' },
        version: { type: 'string' },
        status: { type: 'string' }
      }
    }
  })
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        service: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        version: { type: 'string' }
      }
    }
  })
  getHealth(): object {
    return this.appService.getHealth();
  }
}
