import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { userService } from 'src/users/user.service';

@Injectable()
export class productService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: userService,
  ) {}

  async createProductService(dto: CreateProductDto, userId: string) {
    const user = await this.userService.getCurrentUserService(userId);
    const newProduct = this.productRepository.create({ ...dto, user });
    return await this.productRepository.save(newProduct);
  }

  async getAllProductsService() {
    return await this.productRepository.find();
  }

  async getProductByIdService(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProductService(id: string, dto: UpdateProductDto) {
    const product = await this.getProductByIdService(id);
    Object.assign(product, dto);
    await this.productRepository.save(product);
    return `Product with ID ${id} have been updated`;
  }

  async deleteProductService(id: string) {
    const product = await this.getProductByIdService(id);
    await this.productRepository.remove(product);
    return { message: `Product with ID ${id} has been deleted` };
  }
}
