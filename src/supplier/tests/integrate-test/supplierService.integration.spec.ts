import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierService } from '../../supplier.service';
import { Supplier } from '../../entity/supplier.entity';
import { CreateSupplierDto } from '../../dtos/createSupplier.dto';
import { UpdateSupplierDto } from '../../dtos/updateSupplier.dto';
import { Repository } from 'typeorm';

type MockRepository = Partial<Repository<Supplier>> & {
  create: jest.MockedFunction<(dto: CreateSupplierDto) => Supplier>;
  save: jest.MockedFunction<(supplier: Supplier) => Promise<Supplier>>;
  find: jest.MockedFunction<() => Promise<Supplier[]>>;
  findOneBy: jest.MockedFunction<
    (criteria: Partial<Supplier>) => Promise<Supplier | null>
  >;
  remove: jest.MockedFunction<(supplier: Supplier) => Promise<Supplier>>;
};

describe('SupplierService Integration Tests', () => {
  let supplierService: SupplierService;
  let supplierRepository: Repository<Supplier>;
  let suppliersData: Supplier[] = [];

  const mockRepository: MockRepository = {
    create: jest.fn(
      (dto: CreateSupplierDto) =>
        ({
          ...dto,
          id: 'supplier-1',
        }) as Supplier,
    ),
    save: jest.fn((supplier: Supplier) => {
      const index = suppliersData.findIndex((item) => item.id === supplier.id);
      if (index >= 0) {
        suppliersData[index] = supplier;
      } else {
        suppliersData.push(supplier);
      }
      return supplier;
    }),
    find: jest.fn(() => suppliersData),
    findOneBy: jest.fn(
      (criteria: Partial<Supplier>) =>
        suppliersData.find((item) => item.id === criteria.id) || null,
    ),
    remove: jest.fn((supplier: Supplier) => {
      suppliersData = suppliersData.filter((item) => item.id !== supplier.id);
      return supplier;
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockRepository,
        },
      ],
    }).compile();

    supplierService = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get<Repository<Supplier>>(
      getRepositoryToken(Supplier),
    );
  });

  afterEach(() => {
    suppliersData = [];
    jest.clearAllMocks();
  });

  it('should create a supplier successfully', async () => {
    const createSupplierDto: CreateSupplierDto = {
      supplier_name: 'Supplier One',
      email: 'supplier@example.com',
      phone: '+21612345678',
      address: 'Avenue Centrale',
      registration_number: 'REG-001',
    };

    const result =
      await supplierService.createSupplierService(createSupplierDto);

    expect(result).toBeDefined();
    expect(result.id).toBe('supplier-1');
    expect(result.supplier_name).toBe('Supplier One');

    const saved = await supplierRepository.findOneBy({ id: result.id });
    expect(saved).toBeDefined();
  });

  it('should return all suppliers', async () => {
    await supplierService.createSupplierService({
      supplier_name: 'Supplier Two',
      email: 'supplier2@example.com',
      phone: '+21687654321',
      address: 'Rue Deux',
      registration_number: 'REG-002',
    });

    const result = await supplierService.getAllSuppliersService();

    expect(result).toHaveLength(1);
  });

  it('should return supplier by id', async () => {
    const created = await supplierService.createSupplierService({
      supplier_name: 'Supplier Three',
      email: 'supplier3@example.com',
      phone: '+21611112222',
      address: 'Rue Trois',
      registration_number: 'REG-003',
    });

    const result = await supplierService.getSupplierByIdService(created.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(created.id);
  });

  it('should throw NotFoundException when supplier is missing', async () => {
    await expect(
      supplierService.getSupplierByIdService('missing'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update supplier successfully', async () => {
    const created = await supplierService.createSupplierService({
      supplier_name: 'Supplier Four',
      email: 'supplier4@example.com',
      phone: '+21655556666',
      address: 'Rue Quatre',
      registration_number: 'REG-004',
    });

    const updateSupplierDto: UpdateSupplierDto = {
      supplier_name: 'Supplier Four Updated',
      email: 'supplier4updated@example.com',
      phone: '+21666667777',
      address: 'Rue Quatre Updated',
      registration_number: 'REG-004',
    };

    const result = await supplierService.updateSupplierService(
      created.id,
      updateSupplierDto,
    );

    expect(result).toBeDefined();
    expect(result.supplier_name).toBe('Supplier Four Updated');
  });

  it('should delete supplier successfully', async () => {
    const created = await supplierService.createSupplierService({
      supplier_name: 'Supplier Five',
      email: 'supplier5@example.com',
      phone: '+21677778888',
      address: 'Rue Cinq',
      registration_number: 'REG-005',
    });

    const result = await supplierService.deleteSupplierService(created.id);

    expect(result).toEqual({
      message: `Supplier with ID ${created.id} has been deleted`,
    });
    await expect(
      supplierService.getSupplierByIdService(created.id),
    ).rejects.toThrow(NotFoundException);
  });
});
