import { Module } from '@nestjs/common';
import { productController } from './product.controller';
import { productService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule, JwtModule],
  controllers: [productController],
  providers: [productService],
})
export class ProductModule {}
