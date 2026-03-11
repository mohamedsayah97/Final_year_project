import { Customer } from 'src/customers/entity/customer.entity';
import { Supplier } from 'src/supplier/entity/supplier.entity';
import { UserRole } from 'src/utils/enums';
import { Vehicule } from 'src/vehicules/entity/vehicule.entity';
import { Worker } from 'src/workers/entity/worker.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role!: UserRole;
  @CreateDateColumn()
  registrationDate!: Date;
  @OneToMany(() => Customer, (customer) => customer.user)
  customers!: Customer[];
  @OneToMany(() => Supplier, (supplier) => supplier.user)
  suppliers!: Supplier[];
  @OneToMany(() => Vehicule, (vehicule) => vehicule.user)
  vehicules!: Vehicule[];
  @OneToMany(() => Worker, (worker) => worker.user)
  workers!: Worker[];
}
