import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHello(): object {
    return {
      service: 'MediQ Institution Service',
      version: '1.0.0',
      status: 'running'
    };
  }

  getHealth(): object {
    return {
      status: 'ok',
      service: 'institution-service',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: '1.0.0'
    };
  }
}
