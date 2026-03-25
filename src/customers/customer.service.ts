import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { userService } from 'src/users/user.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly userService: userService,
  ) {}

  public async createCustomerService(dto: CreateCustomerDto, userId: string) {
    const user = await this.userService.getCurrentUserService(userId);
    const newCustomer = this.customerRepository.create({
      ...dto,
      user,
    });
    return await this.customerRepository.save(newCustomer);
  }

  public async getAllCustomersService() {
    return await this.customerRepository.find(); //ici {relations: {user: true, anything else: true}}. n'est pas une maniére globale. dans les methodes
  }

  public async getCustomerByIdService(id: string) {
    const customer = await this.customerRepository.findOneBy({ id }); //ici {relations: {user: true, anything else: true}}. n'est pas une maniére globale. dans les methodes
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  public async updateCustomerService(id: string, dto: UpdateCustomerDto) {
    const customer = await this.getCustomerByIdService(id);
    Object.assign(customer, dto);
    const updatedCustomer = await this.customerRepository.save(customer);
    return updatedCustomer;
  }

  public async deleteCustomerService(id: string) {
    const customer = await this.getCustomerByIdService(id);
    await this.customerRepository.remove(customer);
    return { message: `Customer with ID ${id} has been deleted` };
  }
}
