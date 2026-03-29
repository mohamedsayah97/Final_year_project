import { Test } from '@nestjs/testing';
import { VehiculeController } from '../../vehicule.controller';
import { VehiculeService } from '../../vehicule.service';
import { CreateVehiculeDto } from '../../dtos/createVehicule.dto';
import { UpdateVehiculeDto } from '../../dtos/updateVehicule.dto';

// Mock du VehiculeService
const mockVehiculeService = {
  createVehiculeService: jest.fn(),
  getAllVehiculesService: jest.fn(),
  getVehiculeByIdService: jest.fn(),
  updateVehiculeService: jest.fn(),
  deleteVehiculeService: jest.fn(),
};

describe('VehiculeController', () => {
  let vehiculeController: VehiculeController;
  let vehiculeService: VehiculeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VehiculeController],
      providers: [
        {
          provide: VehiculeService,
          useValue: mockVehiculeService,
        },
      ],
    }).compile();

    vehiculeController = moduleRef.get<VehiculeController>(VehiculeController);
    vehiculeService = moduleRef.get<VehiculeService>(VehiculeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(vehiculeController).toBeDefined();
    expect(vehiculeService).toBeDefined();
  });

  describe('createVehicule', () => {
    it('should create a vehicule successfully', async () => {
      const createVehiculeDto: CreateVehiculeDto = {
        registrationNumber: 'ABC-1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date('2020-01-01'),
        assignedDate: new Date('2020-02-01'),
        currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'available',
      };

      const expectedResult = {
        id: '1',
        ...createVehiculeDto,
        createdAt: new Date(),
      };

      mockVehiculeService.createVehiculeService.mockResolvedValue(
        expectedResult,
      );

      const result = await vehiculeController.createVehicule(createVehiculeDto);

      expect(result).toEqual(expectedResult);
      expect(mockVehiculeService.createVehiculeService).toHaveBeenCalledWith(
        createVehiculeDto,
      );
    });

    it('should handle errors when creating a vehicule', async () => {
      const createVehiculeDto: CreateVehiculeDto = {
        registrationNumber: 'ABC-1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date('2020-01-01'),
        assignedDate: new Date('2020-02-01'),
        currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'available',
      };

      mockVehiculeService.createVehiculeService.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(
        vehiculeController.createVehicule(createVehiculeDto),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('getAllVehicules', () => {
    it('should return an array of vehicules', async () => {
      const expectedVehicules = [
        {
          id: '1',
          registrationNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vehicleType: 'Berline',
          color: 'Red',
          purchaseDate: new Date('2020-01-01'),
          assignedDate: new Date('2020-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'available',
        },
        {
          id: '2',
          registrationNumber: 'DEF-5678',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          vehicleType: 'Berline',
          color: 'Blue',
          purchaseDate: new Date('2019-01-01'),
          assignedDate: new Date('2019-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174001',
          status: 'assigned',
        },
      ];

      mockVehiculeService.getAllVehiculesService.mockResolvedValue(
        expectedVehicules,
      );

      const result = await vehiculeController.getAllVehicules();

      expect(result).toEqual(expectedVehicules);
      expect(mockVehiculeService.getAllVehiculesService).toHaveBeenCalled();
    });

    it('should handle errors when retrieving all vehicules', async () => {
      mockVehiculeService.getAllVehiculesService.mockRejectedValue(
        new Error('Retrieval failed'),
      );
      await expect(vehiculeController.getAllVehicules()).rejects.toThrow(
        'Retrieval failed',
      );
    });

    it('should return an empty array when no vehicules are found', async () => {
      mockVehiculeService.getAllVehiculesService.mockResolvedValue([]);
      const result = await vehiculeController.getAllVehicules();
      expect(result).toEqual([]);
      expect(mockVehiculeService.getAllVehiculesService).toHaveBeenCalled();
    });

    it('should return an array of vehicules with correct properties', async () => {
      const expectedVehicules = [
        {
          id: '1',
          registrationNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vehicleType: 'Berline',
          color: 'Red',
          purchaseDate: new Date('2020-01-01'),
          assignedDate: new Date('2020-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'available',
        },
      ];

      mockVehiculeService.getAllVehiculesService.mockResolvedValue(
        expectedVehicules,
      );

      const result = await vehiculeController.getAllVehicules();
      expect(result).toEqual(expectedVehicules);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('registrationNumber');
      expect(result[0]).toHaveProperty('make');
      expect(result[0]).toHaveProperty('model');
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('vehicleType');
      expect(result[0]).toHaveProperty('color');
      expect(result[0]).toHaveProperty('purchaseDate');
      expect(result[0]).toHaveProperty('assignedDate');
      expect(result[0]).toHaveProperty('currentDriverId');
      expect(result[0]).toHaveProperty('status');
    });

    it('should return an array of vehicules with correct data types', async () => {
      const expectedVehicules = [
        {
          id: '1',
          registrationNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vehicleType: 'Berline',
          color: 'Red',
          purchaseDate: new Date('2020-01-01'),
          assignedDate: new Date('2020-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'available',
        },
      ];

      mockVehiculeService.getAllVehiculesService.mockResolvedValue(
        expectedVehicules,
      );

      const result = await vehiculeController.getAllVehicules();
      expect(result).toEqual(expectedVehicules);
      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].registrationNumber).toBe('string');
      expect(typeof result[0].make).toBe('string');
      expect(typeof result[0].model).toBe('string');
      expect(typeof result[0].year).toBe('number');
      expect(typeof result[0].vehicleType).toBe('string');
      expect(typeof result[0].color).toBe('string');
      expect(result[0].purchaseDate instanceof Date).toBe(true);
      expect(result[0].assignedDate instanceof Date).toBe(true);
      expect(typeof result[0].currentDriverId).toBe('string');
      expect(typeof result[0].status).toBe('string');
    });

    it('should return an array of vehicules with correct values', async () => {
      const expectedVehicules = [
        {
          id: '1',
          registrationNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vehicleType: 'Berline',
          color: 'Red',
          purchaseDate: new Date('2020-01-01'),
          assignedDate: new Date('2020-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'available',
        },
      ];

      mockVehiculeService.getAllVehiculesService.mockResolvedValue(
        expectedVehicules,
      );

      const result = await vehiculeController.getAllVehicules();
      expect(result).toEqual(expectedVehicules);
    });

    it('should return an array of vehicules with correct length', async () => {
      const expectedVehicules = [
        {
          id: '1',
          registrationNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vehicleType: 'Berline',
          color: 'Red',
          purchaseDate: new Date('2020-01-01'),
          assignedDate: new Date('2020-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'available',
        },
        {
          id: '2',
          registrationNumber: 'DEF-5678',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          vehicleType: 'Berline',
          color: 'Blue',
          purchaseDate: new Date('2019-01-01'),
          assignedDate: new Date('2019-02-01'),
          currentDriverId: '123e4567-e89b-12d3-a456-426614174001',
          status: 'assigned',
        },
      ];

      mockVehiculeService.getAllVehiculesService.mockResolvedValue(
        expectedVehicules,
      );

      const result = await vehiculeController.getAllVehicules();
      expect(result).toEqual(expectedVehicules);
      expect(result.length).toBe(2);
    });
  });

  describe('getVehiculeById', () => {
    it('should return a vehicule by ID', async () => {
      const vehiculeId = '1';
      const expectedVehicule = {
        id: vehiculeId,
        registrationNumber: 'ABC-1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date('2020-01-01'),
        assignedDate: new Date('2020-02-01'),
        currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'available',
      };

      mockVehiculeService.getVehiculeByIdService.mockResolvedValue(
        expectedVehicule,
      );

      const result = await vehiculeController.getVehiculeById(vehiculeId);
      expect(result).toEqual(expectedVehicule);
    });

    it('should handle errors when retrieving a vehicule by ID', async () => {
      const vehiculeId = '1';
      mockVehiculeService.getVehiculeByIdService.mockRejectedValue(
        new Error('Vehicule not found'),
      );

      await expect(
        vehiculeController.getVehiculeById(vehiculeId),
      ).rejects.toThrow('Vehicule not found');
    });
  });

  describe('updateVehicule', () => {
    it('should update a vehicule successfully', async () => {
      const vehiculeId = '1';
      const updateVehiculeDto: UpdateVehiculeDto = {
        registrationNumber: 'ABC-1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date('2020-01-01'),
        assignedDate: new Date('2020-02-01'),
        currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'available',
      };
      const expectedResult = {
        ...updateVehiculeDto,
        id: vehiculeId,
      };

      mockVehiculeService.updateVehiculeService.mockResolvedValue(
        expectedResult,
      );

      const result = await vehiculeController.updateVehicule(
        vehiculeId,
        updateVehiculeDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when updating a vehicule', async () => {
      const vehiculeId = '1';
      const updateVehiculeDto: UpdateVehiculeDto = {
        registrationNumber: 'ABC-1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date('2020-01-01'),
        assignedDate: new Date('2020-02-01'),
        currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'available',
      };

      mockVehiculeService.updateVehiculeService.mockRejectedValue(
        new Error('Failed to update vehicule'),
      );

      await expect(
        vehiculeController.updateVehicule(vehiculeId, updateVehiculeDto),
      ).rejects.toThrow('Failed to update vehicule');
    });
  });

  describe('deleteVehicule', () => {
    it('should delete a vehicule successfully', async () => {
      const vehiculeId = '1';
      mockVehiculeService.deleteVehiculeService.mockResolvedValue(true);
      const result = await vehiculeController.deleteVehicule(vehiculeId);
      expect(result).toBe(true);
    });

    it('should handle errors when deleting a vehicule', async () => {
      const vehiculeId = '1';
      mockVehiculeService.deleteVehiculeService.mockRejectedValue(
        new Error('Failed to delete vehicule'),
      );

      await expect(
        vehiculeController.deleteVehicule(vehiculeId),
      ).rejects.toThrow('Failed to delete vehicule');
    });
  });
});
