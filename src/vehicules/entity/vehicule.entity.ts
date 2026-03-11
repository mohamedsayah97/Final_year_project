import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'vehicules' })
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  registrationNumber!: string;

  @Column({ length: 100 })
  make!: string;

  @Column({ length: 100 })
  model!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ length: 50 })
  vehicleType!: string;

  @Column({ length: 30 })
  color!: string;

  @Column({ type: 'date' })
  purchaseDate!: Date;

  @Column({ type: 'date', nullable: true })
  assignedDate!: Date;

  @Column({ type: 'uuid', nullable: true })
  currentDriverId!: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'available',
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.vehicules)
  user!: User;
}
