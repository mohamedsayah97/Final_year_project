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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dtos/createInvoice.dto';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { UpdateInvoiceDto } from './dtos/updateInvoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.Financier) //vérifier les roles
  createInvoice(
    @Body(ValidationPipe) createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.invoiceService.createInvoiceService(
      createInvoiceDto,
      Payload.id,
    );
  }

  @Get('all')
  getAllInvoices() {
    return this.invoiceService.getAllInvoicesService();
  }

  @Get(':id')
  getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Put(':id')
  updateInvoice(
    @Param('id') id: string,
    @Body(ValidationPipe) updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.Financier) //vérifier les roles
  deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }
}
