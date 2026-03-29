import { Test } from '@nestjs/testing';
import { SupplierController } from '../../supplier.controller';
import { SupplierService } from '../../supplier.service';
import { CreateSupplierDto } from '../../dtos/createSupplier.dto';
import { UpdateSupplierDto } from '../../dtos/updateSupplier.dto';

// Mock du SupplierService
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
    const module = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    supplierController = module.get<SupplierController>(SupplierController);
    supplierService = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(supplierController).toBeDefined();
    expect(supplierService).toBeDefined();
  });

  describe('createSupplier', () => {
    it('should create a supplier successfully', async () => {
      const createSupplierDto: CreateSupplierDto = {
        supplier_name: 'Supplier 1',
        email: 'supplier1@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        registration_number: 'REG123456',
      };

      // Utiliser mockResolvedValue pour les promesses
      mockSupplierService.createSupplierService.mockResolvedValue(
        createSupplierDto,
      );

      const result = await supplierController.createSupplier(createSupplierDto);

      expect(result).toEqual(createSupplierDto);
      expect(mockSupplierService.createSupplierService).toHaveBeenCalledWith(
        createSupplierDto,
      );
    });

    it('should throw an error when creation fails', async () => {
      const createSupplierDto: CreateSupplierDto = {
        supplier_name: 'Supplier 1',
        email: 'supplier1@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        registration_number: 'REG123456',
      };

      // Utiliser mockRejectedValue pour les erreurs de promesse
      mockSupplierService.createSupplierService.mockRejectedValue(
        new Error('Failed to create supplier'),
      );

      // Ajouter await devant expect
      await expect(
        supplierController.createSupplier(createSupplierDto),
      ).rejects.toThrow('Failed to create supplier');
      expect(mockSupplierService.createSupplierService).toHaveBeenCalledWith(
        createSupplierDto,
      );
    });
  });

  describe('getAllSuppliers', () => {
    it('should get all suppliers successfully', async () => {
      const suppliers = [
        {
          id: '1',
          supplier_name: 'Supplier 1',
          email: 'supplier1@example.com',
          phone: '123-456-7890',
          address: '123 Main St',
          registration_number: 'REG123456',
        },
        {
          id: '2',
          supplier_name: 'Supplier 2',
          email: 'supplier2@example.com',
          phone: '098-765-4321',
          address: '456 Oak Ave',
          registration_number: 'REG789012',
        },
      ];

      mockSupplierService.getAllSuppliersService.mockResolvedValue(suppliers);

      const result = await supplierController.getAllSuppliers();

      expect(result).toEqual(suppliers);
      expect(mockSupplierService.getAllSuppliersService).toHaveBeenCalled();
    });

    it('should return empty array when no suppliers exist', async () => {
      mockSupplierService.getAllSuppliersService.mockResolvedValue([]);

      const result = await supplierController.getAllSuppliers();

      expect(result).toEqual([]);
      expect(mockSupplierService.getAllSuppliersService).toHaveBeenCalled();
    });

    it('should handle errors when getting all suppliers', async () => {
      mockSupplierService.getAllSuppliersService.mockRejectedValue(
        new Error('Failed to get suppliers'),
      );

      await expect(supplierController.getAllSuppliers()).rejects.toThrow(
        'Failed to get suppliers',
      );
    });
  });

  describe('getSupplierById', () => {
    it('should get a supplier by ID successfully', async () => {
      const supplier = {
        id: '1',
        supplier_name: 'Supplier 1',
        email: 'supplier1@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        registration_number: 'REG123456',
      };

      mockSupplierService.getSupplierByIdService.mockResolvedValue(supplier);

      const result = await supplierController.getSupplierById('1');

      expect(result).toEqual(supplier);
      expect(mockSupplierService.getSupplierByIdService).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should throw an error when supplier not found', async () => {
      mockSupplierService.getSupplierByIdService.mockRejectedValue(
        new Error('Supplier not found'),
      );

      await expect(supplierController.getSupplierById('999')).rejects.toThrow(
        'Supplier not found',
      );
      expect(mockSupplierService.getSupplierByIdService).toHaveBeenCalledWith(
        '999',
      );
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier successfully', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        supplier_name: 'Updated Supplier',
        email: 'updatedsupplier@example.com',
        phone: '555-555-5555',
        address: 'Updated Address',
        registration_number: 'REG654321',
      };

      const updatedSupplier = {
        id: '1',
        ...updateSupplierDto,
      };

      mockSupplierService.updateSupplierService.mockResolvedValue(
        updatedSupplier,
      );

      const result = await supplierController.updateSupplier(
        '1',
        updateSupplierDto,
      );

      expect(result).toEqual(updatedSupplier);
      expect(mockSupplierService.updateSupplierService).toHaveBeenCalledWith(
        '1',
        updateSupplierDto,
      );
    });

    it('should throw an error when update fails', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        supplier_name: 'Updated Supplier',
        email: 'updatedsupplier@example.com',
      };

      mockSupplierService.updateSupplierService.mockRejectedValue(
        new Error('Failed to update supplier'),
      );

      await expect(
        supplierController.updateSupplier('1', updateSupplierDto),
      ).rejects.toThrow('Failed to update supplier');
      expect(mockSupplierService.updateSupplierService).toHaveBeenCalledWith(
        '1',
        updateSupplierDto,
      );
    });
  });

  describe('deleteSupplier', () => {
    it('should delete a supplier successfully', async () => {
      const successResponse = { message: 'Supplier deleted successfully' };

      mockSupplierService.deleteSupplierService.mockResolvedValue(
        successResponse,
      );

      const result = await supplierController.deleteSupplier('1');

      expect(result).toEqual(successResponse);
      expect(mockSupplierService.deleteSupplierService).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should throw an error when deletion fails', async () => {
      mockSupplierService.deleteSupplierService.mockRejectedValue(
        new Error('Failed to delete supplier'),
      );

      await expect(supplierController.deleteSupplier('1')).rejects.toThrow(
        'Failed to delete supplier',
      );
      expect(mockSupplierService.deleteSupplierService).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});
