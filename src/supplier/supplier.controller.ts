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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create')
  createSupplier(@Body(ValidationPipe) createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplierService(createSupplierDto);
  }

  @Get('all')
  getAllSuppliers() {
    return this.supplierService.getAllSuppliersService();
  }

  @Get(':id')
  getSupplierById(@Param('id') id: string) {
    return this.supplierService.getSupplierByIdService(id);
  }

  @Put(':id')
  updateSupplier(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplierService(id, updateSupplierDto);
  }

  @Delete(':id')
  deleteSupplier(@Param('id') id: string) {
    return this.supplierService.deleteSupplierService(id);
  }
}
