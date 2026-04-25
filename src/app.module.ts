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
import { Vehicule } from './vehicules/entity/vehicule.entity';
import { Supplier } from './supplier/entity/supplier.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Worker } from './workers/entity/worker.entity';
import { User } from './users/entity/user.entity';
import { Product } from './products/entity/product.entity';
import { Invoice } from './invoices/entity/invoice.entity';

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
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
          synchronize: process.env.NODE_ENV !== 'production', // Synchroniser uniquement en développement
          entities: [
            Customer,
            Vehicule,
            Supplier,
            Worker,
            User,
            Product,
            Invoice,
          ],
          dropSchema: false, // Nettoie la base avant les tests
          logging: false, // Désactive les logs pour les tests
          // Fixé la DeprecationWarning: Utiliser extra pour éviter les concurrent queries
          extra: {
            // Pool de connexions pour éviter les requêtes concurrentes
            max: 20,
            // Idle timeout pour libérer les connexions
            idleTimeoutMillis: 30000,
          },
          // Augmenté le pool max connections pour meilleure gestion des requêtes parallèles
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
