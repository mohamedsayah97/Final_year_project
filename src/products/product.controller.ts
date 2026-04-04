import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { productService } from './product.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('products')
export class productController {
  constructor(private readonly productService: productService) {}

  @Post('create')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.stock_manager) //vérifier les roles
  createProduct(
    @Body(ValidationPipe) createProduct: CreateProductDto,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.productService.createProductService(createProduct, Payload.id);
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
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.stock_manager) //vérifier les roles
  updateProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProduct: UpdateProductDto,
  ) {
    return this.productService.updateProductService(id, updateProduct);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.stock_manager) //vérifier les roles
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProductService(id);
  }
}
