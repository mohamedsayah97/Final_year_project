import { Test } from '@nestjs/testing';
import { CustomerController } from '../../customer.controller';
import { CustomerService } from '../../customer.service';
import { CreateCustomerDto } from '../../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/update-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { userService } from 'src/users/user.service';
// import { ValidationPipe } from '@nestjs/common';

// Mock du CustomerService
const mockCustomerService = {
  createCustomerService: jest.fn(),
  getAllCustomersService: jest.fn(),
  getCustomerByIdService: jest.fn(),
  updateCustomerService: jest.fn(),
  deleteCustomerService: jest.fn(),
};

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const mockUserService = {
      getCurrentUserService: jest.fn(async (userId) => ({
        id: userId,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'admin',
      })),
    };

    const mockJwtService = {
      verifyAsync: jest.fn(async () => ({
        id: 'test-user-id',
        email: 'test@example.com',
      })),
    };

    const mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'JWT_SECRET_KEY') return 'test-secret-key';
        return null;
      }),
    };

    const mockReflector = {
      getAllAndOverride: jest.fn(() => ['admin']),
    };

    const module = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: userService,
          useValue: mockUserService,
        },
        AuthRolesGuard,
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
    expect(customerService).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        customerType: 'Regular',
      };

      const mockPayload = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const expectedResult = {
        id: '1',
        ...createCustomerDto,
        createdAt: new Date(),
      };

      mockCustomerService.createCustomerService.mockResolvedValue(expectedResult);

      const result = await customerController.createCustomer(createCustomerDto, mockPayload as any);

      expect(result).toEqual(expectedResult);
      expect(mockCustomerService.createCustomerService).toHaveBeenCalledWith(
        createCustomerDto,
        mockPayload.id,
      );
    });

    it('should throw an error when creation fails', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        customerType: 'Regular',
      };

      const mockPayload = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      mockCustomerService.createCustomerService.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(
        customerController.createCustomer(createCustomerDto, mockPayload as any),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const expectedCustomers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: '123 Main St',
          customerType: 'Regular',
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '098-765-4321',
          address: '456 Oak St',
          customerType: 'Premium',
        },
      ];

      mockCustomerService.getAllCustomersService.mockResolvedValue(expectedCustomers);

      const result = await customerController.getAllCustomers();

      expect(result).toEqual(expectedCustomers);
      expect(mockCustomerService.getAllCustomersService).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no customers exist', async () => {
      mockCustomerService.getAllCustomersService.mockResolvedValue([]);

      const result = await customerController.getAllCustomers();

      expect(result).toEqual([]);
      expect(mockCustomerService.getAllCustomersService).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      const customerId = '1';
      const expectedCustomer = {
        id: customerId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        customerType: 'Regular',
      };

      mockCustomerService.getCustomerByIdService.mockResolvedValue(expectedCustomer);

      const result = await customerController.getCustomerById(customerId);

      expect(result).toEqual(expectedCustomer);
      expect(mockCustomerService.getCustomerByIdService).toHaveBeenCalledWith(
        customerId,
      );
    });

    it('should return null when customer not found', async () => {
      const customerId = '999';

      mockCustomerService.getCustomerByIdService.mockResolvedValue(null);

      const result = await customerController.getCustomerById(customerId);

      expect(result).toBeNull();
      expect(mockCustomerService.getCustomerByIdService).toHaveBeenCalledWith(
        customerId,
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const customerId = '1';
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        customerType: 'Regular',
      };

      const expectedResult = {
        id: customerId,
        ...updateCustomerDto,
      };

      mockCustomerService.updateCustomerService.mockResolvedValue(expectedResult);

      const result = await customerController.updateCustomer(
        customerId,
        updateCustomerDto,
      );

      expect(result).toEqual(expectedResult);
      expect(mockCustomerService.updateCustomerService).toHaveBeenCalledWith(
        customerId,
        updateCustomerDto,
      );
    });

    it('should return null when updating non-existing customer', async () => {
      const customerId = '999';
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Non Existing',
        email: 'non@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        customerType: 'Regular',
      };

      mockCustomerService.updateCustomerService.mockResolvedValue(null);

      const result = await customerController.updateCustomer(
        customerId,
        updateCustomerDto,
      );

      expect(result).toBeNull();
      expect(mockCustomerService.updateCustomerService).toHaveBeenCalledWith(
        customerId,
        updateCustomerDto,
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      const customerId = '1';

      mockCustomerService.deleteCustomerService.mockResolvedValue(true);

      const result = await customerController.deleteCustomer(customerId);

      expect(result).toBe(true);
      expect(mockCustomerService.deleteCustomerService).toHaveBeenCalledWith(
        customerId,
      );
    });

    it('should return false when deleting non-existing customer', async () => {
      const customerId = '999';

      mockCustomerService.deleteCustomerService.mockResolvedValue(false);

      const result = await customerController.deleteCustomer(customerId);

      expect(result).toBe(false);
      expect(mockCustomerService.deleteCustomerService).toHaveBeenCalledWith(
        customerId,
      );
    });
  });
});
