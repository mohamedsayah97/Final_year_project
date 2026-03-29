import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  @Column()
  email!: string;
  @Column()
  phoneNumber!: string;
  @Column({ type: 'varchar', length: 100 })
  address!: string;
  @Column()
  customerType!: string;
  @CreateDateColumn()
  registrationDate!: Date;

  @ManyToOne(() => User, (user: User) => user.customers)
  user!: User;
}
