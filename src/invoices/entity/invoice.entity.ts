import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  invoiceNumber!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'timestamp' })
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

  @ManyToOne(() => User, (user: User) => user.invoices)
  user!: User;
}
