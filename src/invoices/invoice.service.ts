import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './entity/invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceDto } from './dtos/createInvoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async createInvoiceService(createInvoiceDto: CreateInvoiceDto) {
    const newInvoice = this.invoiceRepository.create(createInvoiceDto);
    return await this.invoiceRepository.save(newInvoice);
  }

  async getAllInvoicesService() {
    return await this.invoiceRepository.find();
  }

  async getInvoiceById(id: number) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async updateInvoice(id: number, updateInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    Object.assign(invoice, updateInvoiceDto);
    return await this.invoiceRepository.save(invoice);
  }

  async deleteInvoice(id: number) {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    await this.invoiceRepository.remove(invoice);
    return { message: `Invoice with ID ${id} has been deleted` };
  }
}
