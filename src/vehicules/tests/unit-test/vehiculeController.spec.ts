import { Test } from '@nestjs/testing';
import { VehiculeController } from '../../vehicule.controller';
import { VehiculeService } from '../../vehicule.service';
import { CreateVehiculeDto } from '../../dtos/createVehicule.dto';
import { UpdateVehiculeDto } from '../../dtos/updateVehicule.dto';

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
    it('should create a vehicule', async () => {
      const createVehiculeDto: CreateVehiculeDto = {
        registrationNumber: 'TN1234-AB',
        make: 'Toyota',
        model: 'Corolla',
        year: 2023,
        vehicleType: 'Berline',
        color: 'Red',
        purchaseDate: new Date(),
      };
      const expected = { id: '1', ...createVehiculeDto };
      mockVehiculeService.createVehiculeService.mockResolvedValue(expected);

      const result = await vehiculeController.createVehicule(createVehiculeDto);

      expect(result).toEqual(expected);
      expect(mockVehiculeService.createVehiculeService).toHaveBeenCalledWith(
        createVehiculeDto,
      );
    });
  });

  describe('getAllVehicules', () => {
    it('should return vehicules', async () => {
      const resultList = [{ id: '1', registrationNumber: 'TN1234-AB' }];
      mockVehiculeService.getAllVehiculesService.mockResolvedValue(resultList);

      const result = await vehiculeController.getAllVehicules();

      expect(result).toEqual(resultList);
      expect(mockVehiculeService.getAllVehiculesService).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getVehiculeById', () => {
    it('should return vehicule by id', async () => {
      const result = { id: '1', registrationNumber: 'TN1234-AB' };
      mockVehiculeService.getVehiculeByIdService.mockResolvedValue(result);

      const response = await vehiculeController.getVehiculeById('1');

      expect(response).toEqual(result);
      expect(mockVehiculeService.getVehiculeByIdService).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('updateVehicule', () => {
    it('should update vehicule successfully', async () => {
      const updateDto: UpdateVehiculeDto = {
        registrationNumber: 'TN1234-AB',
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
        vehicleType: 'Berline',
        color: 'Blue',
        purchaseDate: new Date(),
      };
      const expected = { id: '1', ...updateDto };
      mockVehiculeService.updateVehiculeService.mockResolvedValue(expected);

      const result = await vehiculeController.updateVehicule('1', updateDto);

      expect(result).toEqual(expected);
      expect(mockVehiculeService.updateVehiculeService).toHaveBeenCalledWith(
        '1',
        updateDto,
      );
    });
  });

  describe('deleteVehicule', () => {
    it('should delete vehicule successfully', async () => {
      const expected = { message: 'deleted' };
      mockVehiculeService.deleteVehiculeService.mockResolvedValue(expected);

      const result = await vehiculeController.deleteVehicule('1');

      expect(result).toEqual(expected);
      expect(mockVehiculeService.deleteVehiculeService).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});
