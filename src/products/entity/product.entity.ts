import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @ManyToOne(() => User, (user: User) => user.products)
  user!: User;
}
