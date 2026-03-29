import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid') // Changé en uuid pour correspondre au type string
  id!: string;

  @Column({ unique: true })
  supplier_code!: string;

  @Column()
  supplier_name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column()
  registration_number!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user: User) => user.suppliers)
  user!: User;

  @BeforeInsert()
  generateSupplierCode() {
    this.supplier_code =
      'SUP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
