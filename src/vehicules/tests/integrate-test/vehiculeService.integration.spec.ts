import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehiculeService } from '../../vehicule.service';
import { Vehicule } from '../../entity/vehicule.entity';
import { CreateVehiculeDto } from '../../dtos/createVehicule.dto';
import { UpdateVehiculeDto } from '../../dtos/updateVehicule.dto';
import { Repository } from 'typeorm';

type MockRepository = Partial<Repository<Vehicule>> & {
  create: jest.MockedFunction<(dto: CreateVehiculeDto) => Vehicule>;
  save: jest.MockedFunction<(vehicule: Vehicule) => Promise<Vehicule>>;
  find: jest.MockedFunction<() => Promise<Vehicule[]>>;
  findOneBy: jest.MockedFunction<
    (criteria: Partial<Vehicule>) => Promise<Vehicule | null>
  >;
  remove: jest.MockedFunction<(vehicule: Vehicule) => Promise<Vehicule>>;
};

describe('VehiculeService Integration Tests', () => {
  let vehiculeService: VehiculeService;
  let vehiculeRepository: Repository<Vehicule>;
  let vehiculesData: Vehicule[] = [];

  const mockRepository: MockRepository = {
    create: jest.fn(
      (dto: CreateVehiculeDto) =>
        ({
          ...dto,
          id: 'vehicule-1',
        }) as Vehicule,
    ),
    save: jest.fn((vehicule: Vehicule) => {
      const index = vehiculesData.findIndex((item) => item.id === vehicule.id);
      if (index >= 0) vehiculesData[index] = vehicule;
      else vehiculesData.push(vehicule);
      return vehicule;
    }),
    find: jest.fn(() => vehiculesData),
    findOneBy: jest.fn(
      (criteria: Partial<Vehicule>) =>
        vehiculesData.find((item) => item.id === criteria.id) || null,
    ),
    remove: jest.fn((vehicule: Vehicule) => {
      vehiculesData = vehiculesData.filter((item) => item.id !== vehicule.id);
      return vehicule;
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculeService,
        {
          provide: getRepositoryToken(Vehicule),
          useValue: mockRepository,
        },
      ],
    }).compile();

    vehiculeService = module.get<VehiculeService>(VehiculeService);
    vehiculeRepository = module.get<Repository<Vehicule>>(
      getRepositoryToken(Vehicule),
    );
  });

  afterEach(() => {
    vehiculesData = [];
    jest.clearAllMocks();
  });

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

    const result =
      await vehiculeService.createVehiculeService(createVehiculeDto);

    expect(result).toBeDefined();
    expect(result.id).toBe('vehicule-1');
    expect(result.registrationNumber).toBe('TN1234-AB');

    const saved = await vehiculeRepository.findOneBy({ id: result.id });
    expect(saved).toBeDefined();
  });

  it('should return all vehicules', async () => {
    await vehiculeService.createVehiculeService({
      registrationNumber: 'TN1234-AC',
      make: 'Renault',
      model: 'Clio',
      year: 2022,
      vehicleType: 'Citadine',
      color: 'Blue',
      purchaseDate: new Date(),
    });

    const result = await vehiculeService.getAllVehiculesService();

    expect(result).toHaveLength(1);
  });

  it('should return vehicule by id', async () => {
    const created = await vehiculeService.createVehiculeService({
      registrationNumber: 'TN1234-AD',
      make: 'Peugeot',
      model: '208',
      year: 2024,
      vehicleType: 'Citadine',
      color: 'White',
      purchaseDate: new Date(),
    });

    const result = await vehiculeService.getVehiculeByIdService(created.id);

    expect(result.id).toBe(created.id);
  });

  it('should throw NotFoundException when vehicule missing', async () => {
    await expect(
      vehiculeService.getVehiculeByIdService('missing'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update vehicule successfully', async () => {
    const created = await vehiculeService.createVehiculeService({
      registrationNumber: 'TN1234-AE',
      make: 'Ford',
      model: 'Focus',
      year: 2021,
      vehicleType: 'Break',
      color: 'Grey',
      purchaseDate: new Date(),
    });

    const updateDto: UpdateVehiculeDto = {
      registrationNumber: created.registrationNumber,
      make: created.make,
      model: created.model,
      year: 2021,
      vehicleType: created.vehicleType,
      color: 'Black',
      purchaseDate: created.purchaseDate,
    };

    const result = await vehiculeService.updateVehiculeService(
      created.id,
      updateDto,
    );

    expect(result.id).toBe(created.id);
    expect(result.color).toBe('Black');
  });

  it('should delete vehicule successfully', async () => {
    const created = await vehiculeService.createVehiculeService({
      registrationNumber: 'TN1234-AF',
      make: 'Fiat',
      model: '500',
      year: 2020,
      vehicleType: 'Citadine',
      color: 'Yellow',
      purchaseDate: new Date(),
    });

    const result = await vehiculeService.deleteVehiculeService(created.id);

    expect(result).toEqual({
      message: `Vehicule with ID ${created.id} has been deleted`,
    });
    await expect(
      vehiculeService.getVehiculeByIdService(created.id),
    ).rejects.toThrow(NotFoundException);
  });
});
