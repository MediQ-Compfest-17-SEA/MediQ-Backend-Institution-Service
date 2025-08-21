import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'institution_service_queue',
      queueOptions: {
        durable: true,
        exclusive: false,
        autoDelete: false,
        arguments: {
          'x-message-ttl': 60000, // 1 minute TTL
          'x-dead-letter-exchange': 'dlx',
          'x-dead-letter-routing-key': 'failed',
        },
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
      prefetchCount: 10,
      isGlobalPrefetch: false,
    },
  });

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('MediQ Institution Service')
    .setDescription('Advanced mikroservice untuk manajemen institusi kesehatan dan layanan medis. Mendukung CRUD institusi, manajemen layanan, pencarian institusi, dan integrasi dengan queue system untuk monitoring antrian real-time.')
    .setVersion('3.0')
    .addTag('institutions', 'Institution management - CRUD institusi kesehatan, pencarian, filtering')
    .addTag('services', 'Institution services - Manajemen layanan medis, scheduling, availability')
    .addTag('health', 'Health check dan monitoring - Service status, database connectivity')
    .addBearerAuth()
    .setContact(
      'MediQ Support',
      'https://mediq.craftthingy.com',
      'support@mediq.com'
    )
    .setLicense(
      'MIT',
      'https://opensource.org/licenses/MIT'
    )
    .addServer('http://localhost:8606', 'Development Server')
    .addServer('https://mediq-institution-service.craftthingy.com', 'Production Server')
    .setExternalDoc('MediQ Documentation', 'https://mediq.craftthingy.com/docs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = configService.get<number>('PORT') ?? 8606;
  await app.listen(port);

  console.log(`Institution service is listening on port ${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`Microservice is listening for RabbitMQ messages`);
}
bootstrap();