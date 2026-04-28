import { Test } from '@nestjs/testing';
import { productController as ProductController } from '../../product.controller';
import { productService as ProductService } from '../../product.service';
import { CreateProductDto } from '../../dtos/createProduct.dto';
import { UpdateProductDto } from '../../dtos/updateProduct.dto';
import type { JWTPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';

const mockProductService = {
  createProductService: jest.fn(),
  getAllProductsService: jest.fn(),
  getProductByIdService: jest.fn(),
  updateProductService: jest.fn(),
  deleteProductService: jest.fn(),
};

describe('ProductController', () => {
  let productController: ProductController;
  let productServiceInstance: ProductService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(AuthRolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    productController = moduleRef.get<ProductController>(ProductController);
    productServiceInstance = moduleRef.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
    expect(productServiceInstance).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Laptop',
        description: 'A powerful laptop',
        price: 1500,
        quantity: 10,
        location: 'Warehouse A',
      };
      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const expected = { id: '1', ...createProductDto };

      mockProductService.createProductService.mockResolvedValue(expected);

      const result = await productController.createProduct(
        createProductDto,
        payload,
      );

      expect(result).toEqual(expected);
      expect(mockProductService.createProductService).toHaveBeenCalledWith(
        createProductDto,
        payload.id,
      );
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ id: '1', name: 'Laptop' }];
      mockProductService.getAllProductsService.mockResolvedValue(products);

      const result = await productController.getAllProducts();

      expect(result).toEqual(products);
      expect(mockProductService.getAllProductsService).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const product = { id: '1', name: 'Laptop' };
      mockProductService.getProductByIdService.mockResolvedValue(product);

      const result = await productController.getProductById('1');

      expect(result).toEqual(product);
      expect(mockProductService.getProductByIdService).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Laptop Pro',
        description: 'A more powerful laptop',
        price: 1700,
        quantity: 8,
        location: 'Warehouse B',
      };
      const expected = 'Product with ID 1 have been updated';
      mockProductService.updateProductService.mockResolvedValue(expected);

      const result = await productController.updateProduct(
        '1',
        updateProductDto,
      );

      expect(result).toEqual(expected);
      expect(mockProductService.updateProductService).toHaveBeenCalledWith(
        '1',
        updateProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const expected = { message: 'deleted' };
      mockProductService.deleteProductService.mockResolvedValue(expected);

      const result = await productController.deleteProduct('1');

      expect(result).toEqual(expected);
      expect(mockProductService.deleteProductService).toHaveBeenCalledWith('1');
    });
  });
});
