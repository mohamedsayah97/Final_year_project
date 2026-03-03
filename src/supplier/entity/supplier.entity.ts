import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true }) // Ajoute unique pour plus de sécurité
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @BeforeInsert()
  generateSupplierCode() {
    this.supplier_code =
      'SUP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
