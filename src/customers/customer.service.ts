import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async createCustomerService(dto: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create(dto);
    return await this.customerRepository.save(newCustomer);
  }

  public async getAllCustomersService() {
    return await this.customerRepository.find();
  }

  public async getCustomerByIdService(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  public async updateCustomerService(id: string, dto: UpdateCustomerDto) {
    const customer = await this.getCustomerByIdService(id);
    Object.assign(customer, dto);
    await this.customerRepository.save(customer);
    return 'Customer updated successfully';
  }

  public async deleteCustomerService(id: string) {
    const customer = await this.getCustomerByIdService(id);
    await this.customerRepository.remove(customer);
    return { message: `Customer with ID ${id} has been deleted` };
  }
}
