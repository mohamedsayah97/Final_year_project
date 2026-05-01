// src/invoices/entity/invoice.entity.ts
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany, // ← Ajouter cet import
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceProduct } from './invoice-product.entity'; // ← Ajouter cet import

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  invoiceNumber!: string;

  @Column()
  date!: Date;

  @Column()
  dueDate!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxAmount!: number;

  @Column()
  status!: string;

  @Column()
  paymentTerms!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;

  // ← Ajouter cette propriété
  @OneToMany(() => InvoiceProduct, (invoiceProduct) => invoiceProduct.invoice)
  invoiceProducts!: InvoiceProduct[];
}
