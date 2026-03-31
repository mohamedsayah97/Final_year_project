import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: number;
  @Column()
  invoiceNumber!: string;
  @CreateDateColumn()
  date!: Date;
  @CreateDateColumn()
  dueDate!: Date;
  @Column()
  totalAmount!: number;
  @Column()
  taxAmount!: number;
  @Column()
  status!: string;
  @Column()
  paymentTerms!: string;
  @CreateDateColumn()
  createdAt!: Date;
}
