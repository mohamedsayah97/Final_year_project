import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CustomerModule } from './customers/customer.module';
import { VehiculeModule } from './vehicules/vehicule.module';
import { InvoiceModule } from './invoices/invoice.module';
import { ProductModule } from './products/product.module';
import { WorkersModule } from './workers/workers.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/entity/customer.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { Vehicule } from './vehicules/entity/vehicule.entity';
import { Supplier } from './supplier/entity/supplier.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Worker } from './workers/entity/worker.entity';
import { User } from './users/entity/user.entity';
import { Product } from './products/entity/product.entity';
import { Invoice } from './invoices/entity/invoice.entity';
import { InvoiceProduct } from './invoices/entity/invoice-product.entity';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    CustomerModule,
    VehiculeModule,
    UserModule,
    InvoiceModule,
    ProductModule,
    WorkersModule,
    SupplierModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn: number | StringValue =
          (configService.get<string>('JWT_EXPIRE_IN') as StringValue) || '1d';

        return {
          secret:
            configService.get<string>('JWT_SECRET_KEY') || 'thisIsPrivateKey',
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isTest = process.env.NODE_ENV === 'test';
        if (isTest) {
          return {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [
              User,
              Customer,
              Vehicule,
              Supplier,
              Worker,
              Product,
              Invoice,
              InvoiceProduct,
            ],
            dropSchema: true,
            logging: false,
          };
        }

        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME') || 'optimanageDB',
          host: config.get<string>('DB_HOST') || 'localhost',
          port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
          username: config.get<string>('DB_USERNAME') || 'postgres',
          password: config.get<string>('DB_PASSWORD') || 'admin',
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [
            Customer,
            Vehicule,
            Supplier,
            Worker,
            User,
            Product,
            Invoice,
            InvoiceProduct,
          ],
          dropSchema: false,
          logging: false,
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
          },
          pool: {
            max: 20,
            min: 2,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
