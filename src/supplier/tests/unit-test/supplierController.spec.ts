import { Test } from '@nestjs/testing';
import { SupplierController } from '../../supplier.controller';
import { SupplierService } from '../../supplier.service';
import { CreateSupplierDto } from '../../dtos/createSupplier.dto';
import { UpdateSupplierDto } from '../../dtos/updateSupplier.dto';

const mockSupplierService = {
  createSupplierService: jest.fn(),
  getAllSuppliersService: jest.fn(),
  getSupplierByIdService: jest.fn(),
  updateSupplierService: jest.fn(),
  deleteSupplierService: jest.fn(),
};

describe('SupplierController', () => {
  let supplierController: SupplierController;
  let supplierService: SupplierService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    supplierController = moduleRef.get<SupplierController>(SupplierController);
    supplierService = moduleRef.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(supplierController).toBeDefined();
    expect(supplierService).toBeDefined();
  });

  describe('createSupplier', () => {
    it('should create a supplier', async () => {
      const createSupplierDto: CreateSupplierDto = {
        supplier_name: 'ABC Corp',
        email: 'abc@example.com',
        phone: '+21612345678',
        address: 'Rue du Commerce',
        registration_number: 'REG-12345',
      };
      const expected = { id: '1', ...createSupplierDto };

      mockSupplierService.createSupplierService.mockResolvedValue(expected);

      const result = await supplierController.createSupplier(createSupplierDto);

      expect(result).toEqual(expected);
      expect(mockSupplierService.createSupplierService).toHaveBeenCalledWith(
        createSupplierDto,
      );
    });
  });

  describe('getAllSuppliers', () => {
    it('should return all suppliers', async () => {
      const suppliers = [{ id: '1', supplier_name: 'ABC Corp' }];
      mockSupplierService.getAllSuppliersService.mockResolvedValue(suppliers);

      const result = await supplierController.getAllSuppliers();

      expect(result).toEqual(suppliers);
      expect(mockSupplierService.getAllSuppliersService).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getSupplierById', () => {
    it('should return supplier by id', async () => {
      const supplier = { id: '1', supplier_name: 'ABC Corp' };
      mockSupplierService.getSupplierByIdService.mockResolvedValue(supplier);

      const result = await supplierController.getSupplierById('1');

      expect(result).toEqual(supplier);
      expect(mockSupplierService.getSupplierByIdService).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('updateSupplier', () => {
    it('should update supplier successfully', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        supplier_name: 'ABC Updated',
        email: 'abc-updated@example.com',
        phone: '+21687654321',
        address: 'Nouvelle Rue',
        registration_number: 'REG-12345',
      };
      const expected = { id: '1', ...updateSupplierDto };
      mockSupplierService.updateSupplierService.mockResolvedValue(expected);

      const result = await supplierController.updateSupplier(
        '1',
        updateSupplierDto,
      );

      expect(result).toEqual(expected);
      expect(mockSupplierService.updateSupplierService).toHaveBeenCalledWith(
        '1',
        updateSupplierDto,
      );
    });
  });

  describe('deleteSupplier', () => {
    it('should delete supplier successfully', async () => {
      const expected = { message: 'deleted' };
      mockSupplierService.deleteSupplierService.mockResolvedValue(expected);

      const result = await supplierController.deleteSupplier('1');

      expect(result).toEqual(expected);
      expect(mockSupplierService.deleteSupplierService).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});
