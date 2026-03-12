import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { productService } from './product.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { updateProductDto } from './dtos/updateProduct.dto';

@Controller('products')
export class productController {
  constructor(private readonly productService: productService) {}

  @Post('create')
  createProduct(@Body(ValidationPipe) createProduct: CreateProductDto) {
    return this.productService.createProductService(createProduct);
  }

  @Get('all')
  getAllProducts() {
    return this.productService.getAllProductsService();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductByIdService(id);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProduct: updateProductDto,
  ) {
    return this.productService.updateProductService(id, updateProduct);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProductService(id);
  }
}
