import { Table, Column, Model, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { CartItem } from './cart.model';
import { OrderItem } from './order.model';

@Table
export class ProductCategory extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => Product)
  products: Product[];
}

@Table
export class Product extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  price: number;

  @Column
  isAvailable: boolean;

  @ForeignKey(() => ProductCategory)
  @Column
  categoryId: number;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @HasMany(() => CartItem)
  cartItems: CartItem[];

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}