import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateInstitutionDto, InstitutionType, InstitutionStatus } from '../src/institution/dto/create-institution.dto';

describe('Institution Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    
    // Setup microservice for RabbitMQ testing
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://test:test@localhost:5672'],
        queue: 'institution_service_queue_test',
        queueOptions: {
          durable: false,
        },
      },
    });

    await app.startAllMicroservices();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Cleanup database
    await prisma.service.deleteMany();
    await prisma.institution.deleteMany();
    await prisma.$disconnect();
    
    // Close application
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.service.deleteMany();
    await prisma.institution.deleteMany();
  });

  describe('Institution CRUD Operations', () => {
    it('should create a new institution', async () => {
      const institutionData: CreateInstitutionDto = {
        name: 'Test Hospital',
        code: 'TH001',
        address: 'Jl. Test No. 123',
        phone: '021-555-1234',
        email: 'admin@testhospital.com',
        type: InstitutionType.HOSPITAL,
        status: InstitutionStatus.ACTIVE,
      };

      const institution = await prisma.institution.create({
        data: institutionData,
      });

      expect(institution).toBeDefined();
      expect(institution.id).toBeValidUUID();
      expect(institution.name).toBe(institutionData.name);
      expect(institution.code).toBe(institutionData.code);
      expect(institution.type).toBe(institutionData.type);
      expect(institution.status).toBe(institutionData.status);
    });

    it('should retrieve all institutions', async () => {
      // Create test institutions
      const institution1 = await prisma.institution.create({
        data: {
          name: 'Hospital 1',
          code: 'H001',
          type: InstitutionType.HOSPITAL,
        },
      });

      const institution2 = await prisma.institution.create({
        data: {
          name: 'Clinic 1',
          code: 'C001',
          type: InstitutionType.CLINIC,
        },
      });

      const institutions = await prisma.institution.findMany();

      expect(institutions).toHaveLength(2);
      expect(institutions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: institution1.id }),
          expect.objectContaining({ id: institution2.id }),
        ])
      );
    });

    it('should retrieve institution with services', async () => {
      // Create institution
      const institution = await prisma.institution.create({
        data: {
          name: 'Test Hospital',
          code: 'TH001',
          type: InstitutionType.HOSPITAL,
        },
      });

      // Create services for institution
      await prisma.service.createMany({
        data: [
          {
            name: 'Emergency Room',
            description: '24/7 emergency services',
            institutionId: institution.id,
          },
          {
            name: 'Cardiology',
            description: 'Heart and cardiovascular services',
            institutionId: institution.id,
          },
        ],
      });

      const institutionWithServices = await prisma.institution.findUnique({
        where: { id: institution.id },
        include: { services: true },
      });

      expect(institutionWithServices).toBeDefined();
      expect(institutionWithServices!.services).toHaveLength(2);
      expect(institutionWithServices!.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Emergency Room' }),
          expect.objectContaining({ name: 'Cardiology' }),
        ])
      );
    });

    it('should update institution', async () => {
      const institution = await prisma.institution.create({
        data: {
          name: 'Old Name',
          code: 'OLD001',
          type: InstitutionType.CLINIC,
          status: InstitutionStatus.ACTIVE,
        },
      });

      const updatedInstitution = await prisma.institution.update({
        where: { id: institution.id },
        data: {
          name: 'New Name',
          status: InstitutionStatus.SUSPENDED,
        },
      });

      expect(updatedInstitution.name).toBe('New Name');
      expect(updatedInstitution.status).toBe(InstitutionStatus.SUSPENDED);
      expect(updatedInstitution.code).toBe('OLD001'); // Should remain unchanged
    });

    it('should delete institution', async () => {
      const institution = await prisma.institution.create({
        data: {
          name: 'To Be Deleted',
          code: 'TBD001',
          type: InstitutionType.PHARMACY,
        },
      });

      await prisma.institution.delete({
        where: { id: institution.id },
      });

      const deletedInstitution = await prisma.institution.findUnique({
        where: { id: institution.id },
      });

      expect(deletedInstitution).toBeNull();
    });
  });

  describe('Database Constraints', () => {
    it('should enforce unique institution code', async () => {
      await prisma.institution.create({
        data: {
          name: 'First Institution',
          code: 'UNIQUE001',
          type: InstitutionType.HOSPITAL,
        },
      });

      await expect(
        prisma.institution.create({
          data: {
            name: 'Second Institution',
            code: 'UNIQUE001', // Duplicate code
            type: InstitutionType.CLINIC,
          },
        })
      ).rejects.toThrow();
    });

    it('should handle cascade delete for services', async () => {
      const institution = await prisma.institution.create({
        data: {
          name: 'Test Hospital',
          code: 'TH001',
          type: InstitutionType.HOSPITAL,
        },
      });

      await prisma.service.create({
        data: {
          name: 'Test Service',
          description: 'Test Description',
          institutionId: institution.id,
        },
      });

      // Delete institution should cascade delete services
      await prisma.institution.delete({
        where: { id: institution.id },
      });

      const services = await prisma.service.findMany({
        where: { institutionId: institution.id },
      });

      expect(services).toHaveLength(0);
    });
  });

  describe('Data Validation', () => {
    it('should validate required fields', async () => {
      await expect(
        prisma.institution.create({
          data: {
            // Missing required fields
          } as any,
        })
      ).rejects.toThrow();
    });

    it('should validate enum values', async () => {
      await expect(
        prisma.institution.create({
          data: {
            name: 'Test Institution',
            code: 'TEST001',
            type: 'INVALID_TYPE' as any,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Service Operations', () => {
    it('should get services for institution', async () => {
      const institution = await prisma.institution.create({
        data: {
          name: 'Medical Center',
          code: 'MC001',
          type: InstitutionType.HOSPITAL,
        },
      });

      const service1 = await prisma.service.create({
        data: {
          name: 'General Medicine',
          description: 'General healthcare services',
          institutionId: institution.id,
        },
      });

      const service2 = await prisma.service.create({
        data: {
          name: 'Pediatrics',
          description: 'Child healthcare services',
          institutionId: institution.id,
        },
      });

      const services = await prisma.service.findMany({
        where: { institutionId: institution.id },
      });

      expect(services).toHaveLength(2);
      expect(services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: service1.id }),
          expect.objectContaining({ id: service2.id }),
        ])
      );
    });
  });
});
