import { UserRole } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from 'src/customers/entity/customer.entity';
import { Supplier } from 'src/supplier/entity/supplier.entity';
import { Vehicule } from 'src/vehicules/entity/vehicule.entity';
import { Worker } from 'src/workers/entity/worker.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  @Column()
  email!: string;
  @Column()
  password!: string;
  @Column()
  phoneNumber!: string;
  @Column()
  address!: string;
  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role!: UserRole;
  @CreateDateColumn()
  registrationDate!: Date;
  @OneToMany(() => Customer, (customer: Customer) => customer.user)
  customers!: Customer[];

  @OneToMany(() => Supplier, (supplier: Supplier) => supplier.user)
  suppliers!: Supplier[];

  @OneToMany(() => Vehicule, (vehicule: Vehicule) => vehicule.user)
  vehicules!: Vehicule[];

  @OneToMany(() => Worker, (worker: Worker) => worker.user)
  workers!: Worker[];
}
