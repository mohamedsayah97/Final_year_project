import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'workers' })
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ name: 'job_title', length: 100 })
  jobTitle!: string;

  @Column({ length: 100 })
  department!: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate!: Date;

  @Column({ name: 'contract_type', length: 50 })
  contractType!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary!: number;

  @Column({ name: 'has_company_car', type: 'boolean', default: false })
  hasCompanyCar!: boolean;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'active',
    comment: 'Statut du worker (active/inactive)',
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.workers)
  user!: User;
}
