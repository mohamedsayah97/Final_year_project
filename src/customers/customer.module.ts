import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), UserModule, JwtModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
