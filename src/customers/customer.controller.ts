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
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerService } from './customer.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { UserRole } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN) //vérifier les roles
  createCustomer(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.customerService.createCustomerService(
      createCustomerDto,
      Payload.id,
    );
  }

  @Get('all')
  getAllCustomers() {
    return this.customerService.getAllCustomersService();
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerByIdService(id);
  }

  @Put(':id')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN) //vérifier les roles
  updateCustomer(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomerService(id, updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN) //vérifier les roles
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomerService(id);
  }
}
