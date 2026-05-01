import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { InvoiceProduct } from './entity/invoice-product.entity'; // ← Ajouter
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceProduct]),
    UserModule,
    JwtModule,
  ], // ← Ajouter InvoiceProduct
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
