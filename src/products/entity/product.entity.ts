import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  name!: string;
  @Column()
  description!: string;
  @Column('float')
  price!: number;
  @Column()
  quantity!: number;
  @Column()
  location!: string;
}
