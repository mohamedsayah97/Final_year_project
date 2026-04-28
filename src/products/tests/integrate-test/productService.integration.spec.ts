import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productService } from '../../product.service';
import { Product } from '../../entity/product.entity';
import { CreateProductDto } from '../../dtos/createProduct.dto';
import { UpdateProductDto } from '../../dtos/updateProduct.dto';
import { userService } from 'src/users/user.service';
import { Repository } from 'typeorm';

type MockProductRepository = Partial<Repository<Product>> & {
  create: jest.MockedFunction<
    (dto: CreateProductDto & Partial<Product>) => Product
  >;
  save: jest.MockedFunction<(product: Product) => Promise<Product>>;
  find: jest.MockedFunction<() => Promise<Product[]>>;
  findOneBy: jest.MockedFunction<
    (criteria: Partial<Product>) => Promise<Product | null>
  >;
  remove: jest.MockedFunction<(product: Product) => Promise<Product>>;
};

describe('ProductService Integration Tests', () => {
  let productServiceInstance: productService;
  let productRepository: Repository<Product>;
  let productsData: Product[] = [];

  const mockRepository: MockProductRepository = {
    create: jest.fn(
      (dto: CreateProductDto) =>
        ({
          ...dto,
          id: 'product-1',
        }) as Product,
    ),
    save: jest.fn((product: Product) => {
      const index = productsData.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        productsData[index] = product;
      } else {
        productsData.push(product);
      }
      return product;
    }),
    find: jest.fn(() => productsData),
    findOneBy: jest.fn(
      (criteria: Partial<Product>) =>
        productsData.find((item) => item.id === criteria.id) || null,
    ),
    remove: jest.fn((product: Product) => {
      productsData = productsData.filter((item) => item.id !== product.id);
      return product;
    }),
  };

  const mockUserService = {
    getCurrentUserService: jest.fn((userId: string) => ({
      id: userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'admin',
    })),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        productService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: userService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    productServiceInstance = module.get<productService>(productService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterEach(() => {
    productsData = [];
    jest.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Keyboard',
      description: 'A mechanical keyboard',
      price: 120,
      quantity: 20,
      location: 'Shelf 5',
    };

    const result = await productServiceInstance.createProductService(
      createProductDto,
      'user-id',
    );

    expect(result).toBeDefined();
    expect(result.id).toBe('product-1');
    expect(result.name).toBe('Keyboard');

    const saved = await productRepository.findOneBy({ id: result.id });
    expect(saved).toBeDefined();
  });

  it('should return all products', async () => {
    await productServiceInstance.createProductService(
      {
        name: 'Mouse',
        description: 'A wireless mouse',
        price: 50,
        quantity: 15,
        location: 'Shelf 1',
      },
      'user-id',
    );

    const result = await productServiceInstance.getAllProductsService();

    expect(result).toHaveLength(1);
  });

  it('should return product by id', async () => {
    const created = await productServiceInstance.createProductService(
      {
        name: 'Webcam',
        description: 'HD webcam',
        price: 80,
        quantity: 8,
        location: 'Shelf 2',
      },
      'user-id',
    );

    const result = await productServiceInstance.getProductByIdService(
      created.id,
    );

    expect(result).toBeDefined();
    expect(result.id).toBe(created.id);
  });

  it('should throw NotFoundException when product does not exist', async () => {
    await expect(
      productServiceInstance.getProductByIdService('missing'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update product successfully', async () => {
    const created = await productServiceInstance.createProductService(
      {
        name: 'Monitor',
        description: '4K monitor',
        price: 300,
        quantity: 5,
        location: 'Shelf 3',
      },
      'user-id',
    );

    const updateDto: UpdateProductDto = {
      name: 'Monitor Pro',
      description: '4K monitor with HDR',
      price: 350,
      quantity: 4,
      location: 'Shelf 3',
    };

    const result = await productServiceInstance.updateProductService(
      created.id,
      updateDto,
    );

    expect(result).toBe('Product with ID product-1 have been updated');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should delete product successfully', async () => {
    const created = await productServiceInstance.createProductService(
      {
        name: 'Tablet',
        description: '8-inch tablet',
        price: 250,
        quantity: 10,
        location: 'Shelf 4',
      },
      'user-id',
    );

    const result = await productServiceInstance.deleteProductService(
      created.id,
    );

    expect(result).toEqual({
      message: `Product with ID ${created.id} has been deleted`,
    });
    await expect(
      productServiceInstance.getProductByIdService(created.id),
    ).rejects.toThrow(NotFoundException);
  });
});
