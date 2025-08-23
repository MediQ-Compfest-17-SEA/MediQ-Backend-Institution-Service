import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto, InstitutionType } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institutioin.dto';

describe('InstitutionController', () => {
  let controller: InstitutionController;
  let service: InstitutionService;

  const mockInstitutionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByName: jest.fn(),
    getInstitutionServices: jest.fn(),
    getServices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [
        {
          provide: InstitutionService,
          useValue: mockInstitutionService,
        },
      ],
    }).compile();

    controller = module.get<InstitutionController>(InstitutionController);
    service = module.get<InstitutionService>(InstitutionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create institution successfully', async () => {
      const createDto: CreateInstitutionDto = {
        name: 'RS Harapan Bunda',
        code: 'RSU001',
        address: 'Jl. Sehat No. 123, Jakarta',
        phone: '021-555-1234',
        type: InstitutionType.HOSPITAL,
      };

      const mockResult = {
        id: 'uuid-string',
        name: 'RS Harapan Bunda',
        address: 'Jl. Sehat No. 123, Jakarta',
        phone: '021-555-1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInstitutionService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(mockInstitutionService.create).toHaveBeenCalledWith(createDto);
      expect(mockInstitutionService.create).toHaveBeenCalledTimes(1);
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
        {
          id: 'uuid-2',
          name: 'Klinik Sehat',
          address: 'Jl. Kesehatan No. 456',
          phone: '021-555-5678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockInstitutionService.findAll.mockResolvedValue(mockInstitutions);

      const result = await controller.findAll();

      expect(result).toEqual(mockInstitutions);
      expect(mockInstitutionService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no institutions exist', async () => {
      mockInstitutionService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockInstitutionService.findAll).toHaveBeenCalledTimes(1);
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

      mockInstitutionService.findOne.mockResolvedValue(mockInstitution);

      const result = await controller.findOne(institutionId);

      expect(result).toEqual(mockInstitution);
      expect(mockInstitutionService.findOne).toHaveBeenCalledWith(institutionId);
    });

    it('should handle institution not found', async () => {
      const institutionId = 'non-existent-id';
      mockInstitutionService.findOne.mockRejectedValue(
        new NotFoundException(`Institusi dengan ID ${institutionId} tidak ditemukan.`),
      );

      await expect(controller.findOne(institutionId)).rejects.toThrow(NotFoundException);
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

      mockInstitutionService.update.mockResolvedValue(mockUpdatedInstitution);

      const result = await controller.update(institutionId, updateDto);

      expect(result).toEqual(mockUpdatedInstitution);
      expect(mockInstitutionService.update).toHaveBeenCalledWith(institutionId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove institution successfully', async () => {
      const institutionId = 'uuid-string';
      const mockResult = {
        message: `Institusi dengan ID ${institutionId} berhasil dihapus.`,
      };

      mockInstitutionService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(institutionId);

      expect(result).toEqual(mockResult);
      expect(mockInstitutionService.remove).toHaveBeenCalledWith(institutionId);
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

      mockInstitutionService.findByName.mockResolvedValue(mockInstitutions);

      const result = await controller.findByName(searchName);

      expect(result).toEqual(mockInstitutions);
      expect(mockInstitutionService.findByName).toHaveBeenCalledWith(searchName);
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

      mockInstitutionService.getInstitutionServices.mockResolvedValue(mockServices);

      const result = await controller.getInstitutionServices(institutionId);

      expect(result).toEqual(mockServices);
      expect(mockInstitutionService.getInstitutionServices).toHaveBeenCalledWith(institutionId);
    });

    it('should return empty array when no services exist', async () => {
      const institutionId = 'uuid-string';
      mockInstitutionService.getInstitutionServices.mockResolvedValue([]);

      const result = await controller.getInstitutionServices(institutionId);

      expect(result).toEqual([]);
      expect(mockInstitutionService.getInstitutionServices).toHaveBeenCalledWith(institutionId);
    });
  });

  // Additional nested coverage inside the same suite to avoid scope issues
  describe('REST getServices (nested)', () => {
    it('should get services via REST getServices', async () => {
      const institutionId = 'uuid-string';
      const mockServices = [
        { id: 's1', name: 'Poli A', location: 'L1', institutionId },
        { id: 's2', name: 'Poli B', location: 'L2', institutionId },
      ];

      (mockInstitutionService.getServices as jest.Mock).mockResolvedValue(mockServices);

      const result = await controller.getServices(institutionId);

      expect(result).toEqual(mockServices);
      expect(mockInstitutionService.getServices).toHaveBeenCalledWith(institutionId);
    });
  });

  describe('Message Patterns (nested)', () => {
    it('handleCreate should delegate to service.create', async () => {
      const dto: CreateInstitutionDto = {
        name: 'RS Sejahtera',
        code: 'RSX001',
        address: 'Jl. A No.1',
        phone: '021-000-000',
        type: InstitutionType.HOSPITAL,
      };
      const created = { id: 'id-1', ...dto, createdAt: new Date(), updatedAt: new Date() };

      (mockInstitutionService.create as jest.Mock).mockResolvedValue(created);

      const result = await controller.handleCreate(dto);
      expect(result).toEqual(created);
      expect(mockInstitutionService.create).toHaveBeenCalledWith(dto);
    });

    it('handleFindAll should delegate to service.findAll', async () => {
      const list = [{ id: 'i1' }, { id: 'i2' }];
      (mockInstitutionService.findAll as jest.Mock).mockResolvedValue(list);

      const result = await controller.handleFindAll();
      expect(result).toEqual(list);
      expect(mockInstitutionService.findAll).toHaveBeenCalledTimes(1);
    });

    it('handleFindOne should delegate to service.findOne', async () => {
      const id = 'uuid-abc';
      const data = { id, name: 'X' };
      (mockInstitutionService.findOne as jest.Mock).mockResolvedValue(data);

      const result = await controller.handleFindOne({ id });
      expect(result).toEqual(data);
      expect(mockInstitutionService.findOne).toHaveBeenCalledWith(id);
    });

    it('handleUpdate should delegate to service.update', async () => {
      const id = 'uuid-abc';
      const update: UpdateInstitutionDto = { name: 'Updated' };
      const updated = { id, name: 'Updated' };
      (mockInstitutionService.update as jest.Mock).mockResolvedValue(updated);

      const result = await controller.handleUpdate({ id, updateData: update });
      expect(result).toEqual(updated);
      expect(mockInstitutionService.update).toHaveBeenCalledWith(id, update);
    });

    it('handleDelete should delegate to service.remove', async () => {
      const id = 'uuid-abc';
      const resp = { message: 'ok' };
      (mockInstitutionService.remove as jest.Mock).mockResolvedValue(resp);

      const result = await controller.handleDelete({ id });
      expect(result).toEqual(resp);
      expect(mockInstitutionService.remove).toHaveBeenCalledWith(id);
    });

    it('handleGetServices should delegate to service.getServices', async () => {
      const id = 'uuid-abc';
      const services = [{ id: 's1' }];
      (mockInstitutionService.getServices as jest.Mock).mockResolvedValue(services);

      const result = await controller.handleGetServices({ id });
      expect(result).toEqual(services);
      expect(mockInstitutionService.getServices).toHaveBeenCalledWith(id);
    });

    it('handleFindByName should delegate to service.findByName', async () => {
      const searchName = 'Harapan';
      const list = [{ id: 'i1', name: 'RS Harapan' }];
      (mockInstitutionService.findByName as jest.Mock).mockResolvedValue(list);

      const result = await controller.handleFindByName({ searchName });
      expect(result).toEqual(list);
      expect(mockInstitutionService.findByName).toHaveBeenCalledWith(searchName);
    });

    it('handleHealthCheck should return health payload', async () => {
      const result = await controller.handleHealthCheck();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('institution-service');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
