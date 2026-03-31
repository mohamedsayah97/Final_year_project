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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dtos/createInvoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  createInvoice(@Body(ValidationPipe) createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoiceService(createInvoiceDto);
  }

  @Get('all')
  getAllInvoices() {
    return this.invoiceService.getAllInvoicesService();
  }

  @Get(':id')
  getInvoiceById(@Param('id') id: number) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Put(':id')
  updateInvoice(
    @Param('id') id: number,
    @Body(ValidationPipe) updateInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  deleteInvoice(@Param('id') id: number) {
    return this.invoiceService.deleteInvoice(id);
  }
}
