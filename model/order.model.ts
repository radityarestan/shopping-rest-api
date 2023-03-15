import { Table, Column, Model, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Discount } from './discount.model';
import { Product } from './product.model';
import { User } from './user.model';

@Table
export class Order extends Model {
  @Column
  totalPriceAfterDiscount: number;

  @Column
  totalPriceInCart: number;

  @Column
  address: string;

  @HasMany(() => OrderItem)
  items: OrderItem[];

  @ForeignKey(() => User)
  @Column
  userId: number;
  
  @BelongsTo(() => User)
  user: User;
  
  @ForeignKey(() => Discount)
  @Column
  discountId: number;

  @BelongsTo(() => Discount)
  discount: Discount;
}

@Table
export class OrderItem extends Model {
  @Column
  quantity: number;

  @Column
  notes: string;

  @Column
  productPrice: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}