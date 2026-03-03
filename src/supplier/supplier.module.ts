import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entity/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
