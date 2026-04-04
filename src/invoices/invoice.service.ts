import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './entity/invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceDto } from './dtos/createInvoice.dto';
import { userService } from 'src/users/user.service';
import { UpdateInvoiceDto } from './dtos/updateInvoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly userService: userService,
  ) {}

  async createInvoiceService(dto: CreateInvoiceDto, userId: string) {
    const user = await this.userService.getCurrentUserService(userId);
    const newInvoice = this.invoiceRepository.create({
      ...dto,
      user,
    });
    return await this.invoiceRepository.save(newInvoice);
  }

  async getAllInvoicesService() {
    return await this.invoiceRepository.find();
  }

  async getInvoiceById(id: string) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    Object.assign(invoice, updateInvoiceDto);
    return await this.invoiceRepository.save(invoice);
  }

  async deleteInvoice(id: string) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    await this.invoiceRepository.remove(invoice);
    return { message: `Invoice with ID ${id} has been deleted` };
  }
}
