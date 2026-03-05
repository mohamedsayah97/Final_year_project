import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entity/supplier.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  public async createSupplierService(createSupplierDto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  public async getAllSuppliersService() {
    return await this.supplierRepository.find();
  }

  public async getSupplierByIdService(id: string) {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  public async updateSupplierService(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.getSupplierByIdService(id);
    Object.assign(supplier, updateSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  public async deleteSupplierService(id: string) {
    const supplier = await this.getSupplierByIdService(id);
    await this.supplierRepository.remove(supplier);
    return { message: `Supplier with ID ${id} has been deleted` };
  }
}
