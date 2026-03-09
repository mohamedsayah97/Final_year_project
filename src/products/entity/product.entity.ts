import { PrimaryGeneratedColumn } from "typeorm";


export class Product {
  @PrimaryGeneratedColumn()
  id!: number;
    name!: string;
    description!: string;
    price!: number;
    createdAt!: Date;
    updatedAt!: Date;
}