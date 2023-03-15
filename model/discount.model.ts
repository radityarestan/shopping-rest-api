import { Table, Model, Column, HasMany } from "sequelize-typescript";
import { Order } from "./order.model";

@Table
export class Discount extends Model {
  @Column
  name: string;

  @Column
  price: number;

  @HasMany(() => Order)
  orders: Order[];
}