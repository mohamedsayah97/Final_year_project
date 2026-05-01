// src/invoices/entities/invoice-product.entity.ts
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from '../../products/entity/product.entity';

@Entity({ name: 'invoice_products' })
export class InvoiceProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceProducts)
  invoice!: Invoice;

  @ManyToOne(() => Product, (product) => product.invoiceProducts)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;
}
