import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CustomerModule } from './customers/customer.module';
import { VehiculeModule } from './vehicules/vehicule.module';
import { InvoiceModule } from './invoices/invoice.module';
import { ProductModule } from './products/product.module';
import { WorkersModule } from './workers/workers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/entity/customer.entity';

@Module({
  imports: [
    CustomerModule,
    VehiculeModule,
    UserModule,
    InvoiceModule,
    ProductModule,
    WorkersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'optimanageDB',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      synchronize: true,
      entities: [Customer],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
