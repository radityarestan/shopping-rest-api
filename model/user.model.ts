import { Table, Model, BelongsTo, Column, HasOne, HasMany } from "sequelize-typescript";
import { Cart } from "./cart.model";
import { Order } from "./order.model";

@Table
export class User extends Model {
  @Column
  username: string;

  @HasOne(() => Cart)
  cart: Cart;

  @HasMany(() => Order)
  orders: Order[];
}