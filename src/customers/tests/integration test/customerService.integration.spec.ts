import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../entity/customer.entity';
import { CreateCustomerDto } from '../../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/update-customer.dto';
import { Repository } from 'typeorm';
import { userService } from 'src/users/user.service';

describe('CustomerService Integration Tests', () => {
  let customerService: CustomerService;
  let customerRepository: Repository<Customer>;
  let customersData: Customer[] = [];

  type MockCustomerRepository = Partial<Repository<Customer>> & {
    create: jest.MockedFunction<
      (dto: CreateCustomerDto & Partial<Customer>) => Customer
    >;
    save: jest.MockedFunction<(customer: Customer) => Promise<Customer>>;
    find: jest.MockedFunction<() => Promise<Customer[]>>;
    findOneBy: jest.MockedFunction<
      (criteria: Partial<Customer>) => Promise<Customer | null>
    >;
    remove: jest.MockedFunction<(customer: Customer) => Promise<Customer>>;
    clear: jest.MockedFunction<() => Promise<void>>;
  };

  // Mock repository
  const mockRepository: MockCustomerRepository = {
    create: jest.fn(
      (dto: CreateCustomerDto) =>
        ({
          ...dto,
          id: '550e8400-e29b-41d4-a716-446655440000',
          registrationDate: new Date(),
        }) as Customer,
    ),
    save: jest.fn((customer: Customer) => {
      // Ajouter aux données mock
      const result: Customer = { ...customer };
      if (!customersData.find((c) => c.id === result.id)) {
        customersData.push(result);
      } else {
        const index = customersData.findIndex((c) => c.id === result.id);
        customersData[index] = result;
      }
      return Promise.resolve(result);
    }),
    find: jest.fn(() => Promise.resolve(customersData)),
    findOneBy: jest.fn((criteria: Partial<Customer>) =>
      Promise.resolve(customersData.find((c) => c.id === criteria.id) || null),
    ),
    remove: jest.fn((customer: Customer) => {
      customersData = customersData.filter((c) => c.id !== customer.id);
      return Promise.resolve(customer);
    }),
    clear: jest.fn(() => {
      customersData = [];
      return Promise.resolve();
    }),
  };

  beforeAll(async () => {
    const mockUserService = {
      getCurrentUserService: jest.fn((userId: string) => ({
        id: userId,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'admin',
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository as unknown as Repository<Customer>,
        },
        {
          provide: userService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  afterEach(() => {
    // Nettoyer les données après chaque test
    customersData = [];
    jest.clearAllMocks();
  });

  describe('createCustomerService', () => {
    it('devrait créer un nouveau client avec succès', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed@example.com',
        phoneNumber: '+21612345678',
        address: 'Rue de la Paix 123, Tunis',
        customerType: 'individual',
      };

      const result = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Ahmed');
      expect(result.lastName).toBe('Ben Ali');
      expect(result.email).toBe('ahmed@example.com');
      expect(result.phoneNumber).toBe('+21612345678');
      expect(result.address).toBe('Rue de la Paix 123, Tunis');
      expect(result.customerType).toBe('individual');

      // Vérifier que le client est bien en base de données (mock)
      const savedCustomer = await customerRepository.findOneBy({
        id: result.id,
      });
      expect(savedCustomer).toBeDefined();
      if (savedCustomer) {
        expect(savedCustomer.email).toBe('ahmed@example.com');
      }
    });

    it('devrait générer une date de registration lors de la création', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Fatima',
        lastName: 'Zid',
        email: 'fatima@example.com',
        phoneNumber: '+21695543210',
        address: 'Boulevard Principal 456, Sfax',
        customerType: 'business',
      };

      const result = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      expect(result.registrationDate).toBeDefined();
      expect(result.registrationDate).toBeInstanceOf(Date);
    });
  });

  describe('getAllCustomersService', () => {
    it('devrait retourner un tableau vide si aucun client', async () => {
      customersData = [];
      const result = await customerService.getAllCustomersService();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('devrait retourner tous les clients', async () => {
      // Créer plusieurs clients
      const customer1: CreateCustomerDto = {
        firstName: 'Ali',
        lastName: 'Saïd',
        email: 'ali@example.com',
        phoneNumber: '+21612111111',
        address: 'Rue 1, Tunis',
        customerType: 'individual',
      };

      const customer2: CreateCustomerDto = {
        firstName: 'Leila',
        lastName: 'Smet',
        email: 'leila@example.com',
        phoneNumber: '+21612222222',
        address: 'Rue 2, Ariana',
        customerType: 'business',
      };

      const customer3: CreateCustomerDto = {
        firstName: 'Mohamed',
        lastName: 'Amin',
        email: 'mohamed@example.com',
        phoneNumber: '+21612333333',
        address: 'Rue 3, Kairouan',
        customerType: 'individual',
      };

      // Créer avec des IDs uniques
      mockRepository.create.mockImplementationOnce((dto) => ({
        ...dto,
        id: '550e8400-e29b-41d4-a716-446655440001',
        registrationDate: new Date(),
      }));
      mockRepository.create.mockImplementationOnce((dto) => ({
        ...dto,
        id: '550e8400-e29b-41d4-a716-446655440002',
        registrationDate: new Date(),
      }));
      mockRepository.create.mockImplementationOnce((dto) => ({
        ...dto,
        id: '550e8400-e29b-41d4-a716-446655440003',
        registrationDate: new Date(),
      }));

      await customerService.createCustomerService(customer1, 'test-user-id');
      await customerService.createCustomerService(customer2, 'test-user-id');
      await customerService.createCustomerService(customer3, 'test-user-id');

      const result = await customerService.getAllCustomersService();

      expect(result).toHaveLength(3);
      expect(result[0].firstName).toBe('Ali');
      expect(result[1].firstName).toBe('Leila');
      expect(result[2].firstName).toBe('Mohamed');
    });
  });

  describe('getCustomerByIdService', () => {
    it('devrait retourner un client par son ID', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Noor',
        lastName: 'Jamal',
        email: 'noor@example.com',
        phoneNumber: '+21613333333',
        address: 'Rue Noor, Sousse',
        customerType: 'individual',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      const result = await customerService.getCustomerByIdService(
        createdCustomer.id,
      );

      expect(result).toBeDefined();
      expect(result.id).toBe(createdCustomer.id);
      expect(result.firstName).toBe('Noor');
      expect(result.email).toBe('noor@example.com');
    });

    it("devrait lever une exception NotFoundException si le client n'existe pas", async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440999';

      await expect(
        customerService.getCustomerByIdService(nonExistentId),
      ).rejects.toThrow(NotFoundException);

      await expect(
        customerService.getCustomerByIdService(nonExistentId),
      ).rejects.toThrow(`Customer with ID ${nonExistentId} not found`);
    });
  });

  describe('updateCustomerService', () => {
    it('devrait mettre à jour un client avec succès', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Karim',
        lastName: 'Ben Youssef',
        email: 'karim@example.com',
        phoneNumber: '+21614444444',
        address: 'Rue Karim, Gafsa',
        customerType: 'individual',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      const updateCustomerDto: UpdateCustomerDto = {
        firstName: 'Karim Updated',
        email: 'karim.updated@example.com',
        phoneNumber: '+21615555555',
      };

      const result = await customerService.updateCustomerService(
        createdCustomer.id,
        updateCustomerDto,
      );

      expect(result.firstName).toBe('Karim Updated');
      expect(result.email).toBe('karim.updated@example.com');
      expect(result.phoneNumber).toBe('+21615555555');
      // Les autres champs doivent rester inchangés
      expect(result.lastName).toBe('Ben Youssef');
      expect(result.address).toBe('Rue Karim, Gafsa');
    });

    it('devrait mettre à jour partiellement un client', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Ranya',
        lastName: 'Mzali',
        email: 'ranya@example.com',
        phoneNumber: '+21616666666',
        address: 'Rue Ranya, Tozeur',
        customerType: 'business',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      // Mettre à jour seulement le prénom
      const updateCustomerDto: UpdateCustomerDto = {
        firstName: 'Ranya Pro',
      };

      const result = await customerService.updateCustomerService(
        createdCustomer.id,
        updateCustomerDto,
      );

      expect(result.firstName).toBe('Ranya Pro');
      expect(result.lastName).toBe('Mzali');
      expect(result.email).toBe('ranya@example.com');
      expect(result.phoneNumber).toBe('+21616666666');
    });

    it('devrait lever une exception si on met à jour un client inexistant', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440999';
      const updateCustomerDto: UpdateCustomerDto = {
        firstName: 'Inexistant',
      };

      await expect(
        customerService.updateCustomerService(nonExistentId, updateCustomerDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCustomerService', () => {
    it('devrait supprimer un client avec succès', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Jamal',
        lastName: 'Amara',
        email: 'jamal@example.com',
        phoneNumber: '+21617777777',
        address: 'Rue Jamal, Médenine',
        customerType: 'individual',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );

      const result = await customerService.deleteCustomerService(
        createdCustomer.id,
      );

      expect(result.message).toBe(
        `Customer with ID ${createdCustomer.id} has been deleted`,
      );

      // Vérifier que le client est bien supprimé de la base
      const deletedCustomer = await customerRepository.findOneBy({
        id: createdCustomer.id,
      });
      expect(deletedCustomer).toBeNull();
    });

    it('devrait lever une exception si on supprime un client inexistant', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440999';

      await expect(
        customerService.deleteCustomerService(nonExistentId),
      ).rejects.toThrow(NotFoundException);
    });

    it('devrait vérifier que le client est bien supprimé avec getAllCustomersService', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Samir',
        lastName: 'Bennani',
        email: 'samir@example.com',
        phoneNumber: '+21618888888',
        address: 'Rue Samir, Kebili',
        customerType: 'business',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );
      let allCustomers = await customerService.getAllCustomersService();
      expect(allCustomers).toHaveLength(1);

      await customerService.deleteCustomerService(createdCustomer.id);
      allCustomers = await customerService.getAllCustomersService();
      expect(allCustomers).toHaveLength(0);
    });
  });

  describe('Scénarios complets', () => {
    it('devrait gérer un cycle complet CRUD', async () => {
      // CREATE
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'Hassan',
        lastName: 'Gharbi',
        email: 'hassan@example.com',
        phoneNumber: '+21619999999',
        address: 'Rue Hassan, Tataouine',
        customerType: 'individual',
      };

      const createdCustomer = await customerService.createCustomerService(
        createCustomerDto,
        'test-user-id',
      );
      expect(createdCustomer.id).toBeDefined();

      // READ
      const retrievedCustomer = await customerService.getCustomerByIdService(
        createdCustomer.id,
      );
      expect(retrievedCustomer.firstName).toBe('Hassan');

      // UPDATE
      const updateDto: UpdateCustomerDto = {
        firstName: 'Hassan El Gharbi',
        customerType: 'business',
      };

      const updatedCustomer = await customerService.updateCustomerService(
        createdCustomer.id,
        updateDto,
      );
      expect(updatedCustomer.firstName).toBe('Hassan El Gharbi');
      expect(updatedCustomer.customerType).toBe('business');

      // VERIFY UPDATE WITH READ
      const verifyCustomer = await customerService.getCustomerByIdService(
        createdCustomer.id,
      );
      expect(verifyCustomer.firstName).toBe('Hassan El Gharbi');

      // DELETE
      const deleteResult = await customerService.deleteCustomerService(
        createdCustomer.id,
      );
      expect(deleteResult.message).toContain('has been deleted');

      // VERIFY DELETE
      await expect(
        customerService.getCustomerByIdService(createdCustomer.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('devrait gérer plusieurs clients simultanément', async () => {
      const customers: CreateCustomerDto[] = [
        {
          firstName: 'Client 1',
          lastName: 'Test',
          email: 'client1@example.com',
          phoneNumber: '+21620000001',
          address: 'Rue 1',
          customerType: 'individual',
        },
        {
          firstName: 'Client 2',
          lastName: 'Test',
          email: 'client2@example.com',
          phoneNumber: '+21620000002',
          address: 'Rue 2',
          customerType: 'business',
        },
        {
          firstName: 'Client 3',
          lastName: 'Test',
          email: 'client3@example.com',
          phoneNumber: '+21620000003',
          address: 'Rue 3',
          customerType: 'individual',
        },
      ];

      // Configuration des IDs uniques pour chaque création
      let idCounter = 1;
      mockRepository.create.mockImplementation((dto) => ({
        ...dto,
        id: `550e8400-e29b-41d4-a716-44665544000${idCounter++}`,
        registrationDate: new Date(),
      }));

      // Créer tous les clients
      const createdCustomers = await Promise.all(
        customers.map((dto) =>
          customerService.createCustomerService(dto, 'test-user-id'),
        ),
      );

      expect(createdCustomers).toHaveLength(3);

      // Vérifier que tous sont en base
      const allCustomers = await customerService.getAllCustomersService();
      expect(allCustomers).toHaveLength(3);

      // Mettre à jour le deuxième client
      const updateDto: UpdateCustomerDto = {
        firstName: 'Client 2 Updated',
      };

      await customerService.updateCustomerService(
        createdCustomers[1].id,
        updateDto,
      );

      // Supprimer le premier client
      await customerService.deleteCustomerService(createdCustomers[0].id);

      // Vérifier l'état final
      const finalCustomers = await customerService.getAllCustomersService();
      expect(finalCustomers).toHaveLength(2);
      expect(
        finalCustomers.some((c) => c.firstName === 'Client 2 Updated'),
      ).toBe(true);
      expect(finalCustomers.some((c) => c.firstName === 'Client 1')).toBe(
        false,
      );
    });
  });
});
