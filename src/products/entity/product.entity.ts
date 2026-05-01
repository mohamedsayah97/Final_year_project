// src/products/entity/product.entity.ts
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceProduct } from 'src/invoices/entity/invoice-product.entity'; // ← Ajouter cet import

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('float')
  price!: number;

  @Column()
  quantity!: number;

  @Column()
  location!: string;

  @ManyToOne(() => User)
  user!: User;

  // ← Ajouter cette propriété
  @OneToMany(() => InvoiceProduct, (invoiceProduct) => invoiceProduct.product)
  invoiceProducts!: InvoiceProduct[];
}
