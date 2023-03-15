import { Table, Column, Model, HasMany, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript'
import { Product } from './product.model';
import { User } from './user.model';

@Table
export class Cart extends Model {
  @Column
  totalPrice: number;

  @HasMany(() => CartItem)
  items: CartItem[];

  @ForeignKey(() => User)
  @Column
  userId: number;
  
  @BelongsTo(() => User)
  user: User;
}

@Table
export class CartItem extends Model {
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

  @ForeignKey(() => Cart)
  @Column
  cartId: number;

  @BelongsTo(() => Cart)
  cart: Cart;
}