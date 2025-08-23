import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institutioin.dto';

describe('InstitutionService', () => {
  let service: InstitutionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    institution: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create institution successfully', async () => {
      const createDto: CreateInstitutionDto = {
        name: 'RS Harapan Bunda',
        address: 'Jl. Sehat No. 123, Jakarta',
        phone: '021-555-1234',
      };

      const mockResult = {
        id: 'uuid-string',
        name: 'RS Harapan Bunda',
        address: 'Jl. Sehat No. 123, Jakarta',
        phone: '021-555-1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.institution.create.mockResolvedValue(mockResult);

      const result = await service.create(createDto);

      expect(result).toEqual(mockResult);
      expect(mockPrismaService.institution.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all institutions', async () => {
      const mockInstitutions = [
        {
          id: 'uuid-1',
          name: 'RS Harapan Bunda',
          address: 'Jl. Sehat No. 123',
          phone: '021-555-1234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.institution.findMany.mockResolvedValue(mockInstitutions);

      const result = await service.findAll();

      expect(result).toEqual(mockInstitutions);
      expect(mockPrismaService.institution.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no institutions exist', async () => {
      mockPrismaService.institution.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.institution.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return institution by ID', async () => {
      const institutionId = 'uuid-string';
      const mockInstitution = {
        id: institutionId,
        name: 'RS Harapan Bunda',
        address: 'Jl. Sehat No. 123',
        phone: '021-555-1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.institution.findUnique.mockResolvedValue(mockInstitution);

      const result = await service.findOne(institutionId);

      expect(result).toEqual(mockInstitution);
      expect(mockPrismaService.institution.findUnique).toHaveBeenCalledWith({
        where: { id: institutionId },
        include: { services: true },
      });
    });

    it('should throw NotFoundException when institution not found', async () => {
      const institutionId = 'non-existent-id';
      mockPrismaService.institution.findUnique.mockResolvedValue(null);

      await expect(service.findOne(institutionId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(institutionId)).rejects.toThrow(
        `Institusi dengan ID ${institutionId} tidak ditemukan.`,
      );
    });
  });

  describe('update', () => {
    it('should update institution successfully', async () => {
      const institutionId = 'uuid-string';
      const updateDto: UpdateInstitutionDto = {
        name: 'RS Harapan Sejahtera',
        phone: '021-555-9999',
      };

      const mockUpdatedInstitution = {
        id: institutionId,
        name: 'RS Harapan Sejahtera',
        address: 'Jl. Sehat No. 123',
        phone: '021-555-9999',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.institution.update.mockResolvedValue(mockUpdatedInstitution);

      const result = await service.update(institutionId, updateDto);

      expect(result).toEqual(mockUpdatedInstitution);
      expect(mockPrismaService.institution.update).toHaveBeenCalledWith({
        where: { id: institutionId },
        data: updateDto,
      });
    });

    it('should throw NotFoundException when institution not found', async () => {
      const institutionId = 'non-existent-id';
      const updateDto: UpdateInstitutionDto = {
        name: 'Updated Name',
      };

      mockPrismaService.institution.update.mockRejectedValue(new Error('Record not found'));

      await expect(service.update(institutionId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(institutionId, updateDto)).rejects.toThrow(
        `Institusi dengan ID ${institutionId} tidak ditemukan.`,
      );
    });
  });

  describe('remove', () => {
    it('should remove institution successfully', async () => {
      const institutionId = 'uuid-string';
      
      mockPrismaService.institution.delete.mockResolvedValue({});

      const result = await service.remove(institutionId);

      expect(result).toEqual({
        message: `Institusi dengan ID ${institutionId} berhasil dihapus.`,
      });
      expect(mockPrismaService.institution.delete).toHaveBeenCalledWith({
        where: { id: institutionId },
      });
    });

    it('should throw NotFoundException when institution not found', async () => {
      const institutionId = 'non-existent-id';

      mockPrismaService.institution.delete.mockRejectedValue(new Error('Record not found'));

      await expect(service.remove(institutionId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(institutionId)).rejects.toThrow(
        `Institusi dengan ID ${institutionId} tidak ditemukan.`,
      );
    });
  });

  describe('findByName', () => {
    it('should find institutions by name', async () => {
      const searchName = 'Harapan';
      const mockInstitutions = [
        {
          id: 'uuid-1',
          name: 'RS Harapan Bunda',
          address: 'Jl. Sehat No. 123',
          phone: '021-555-1234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.institution.findMany.mockResolvedValue(mockInstitutions);

      const result = await service.findByName(searchName);

      expect(result).toEqual(mockInstitutions);
      expect(mockPrismaService.institution.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: searchName,
            
          },
        },
        include: { services: true },
      });
    });

    it('should return empty array when no matching institutions found', async () => {
      const searchName = 'NonExistent';
      mockPrismaService.institution.findMany.mockResolvedValue([]);

      const result = await service.findByName(searchName);

      expect(result).toEqual([]);
      expect(mockPrismaService.institution.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: searchName,
            
          },
        },
        include: { services: true },
      });
    });
  });

  describe('getInstitutionServices', () => {
    it('should get services for institution', async () => {
      const institutionId = 'uuid-string';
      const mockServices = [
        {
          id: 'service-1',
          name: 'Poli Umum',
          location: 'Lantai 1',
          institutionId,
        },
        {
          id: 'service-2',
          name: 'Poli Gigi', 
          location: 'Lantai 2',
          institutionId,
        },
      ];

      mockPrismaService.service.findMany.mockResolvedValue(mockServices);

      const result = await service.getInstitutionServices(institutionId);

      expect(result).toEqual(mockServices);
      expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
        where: { institutionId },
      });
    });

    it('should return empty array when no services exist for institution', async () => {
      const institutionId = 'uuid-string';
      mockPrismaService.service.findMany.mockResolvedValue([]);

      const result = await service.getInstitutionServices(institutionId);

      expect(result).toEqual([]);
      expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
        where: { institutionId },
      });
    });
  });
});
