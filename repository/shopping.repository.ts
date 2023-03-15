import * as fs from 'fs';

import { connect } from '../config/db.config';
import { Logger } from '../logger/logger';
import { Cart, CartItem } from '../model/cart.model';
import { Discount } from '../model/discount.model';
import { Order, OrderItem } from '../model/order.model';
import { Product, ProductCategory } from '../model/product.model';

export class ShoppingRepository {
  private logger: Logger;
  private db: any = {};
  private productRepo: any = {};
  private productCategoryRepo: any = {};
  private cartRepo: any = {};
  private cartItemRepo: any = {};
  private orderRepo: any = {};
  private orderItemRepo: any = {};
  private discountRepo: any = {};

  constructor() {
    this.logger = new Logger();
    
    this.db = connect();
    
    this.db.sequelize.sync({ force: true }).then(() => {
      this.logger.info("Drop, re-sync, and seeding the db", null);

      const userQuery = fs.readFileSync('./seeders/user-seed.sql', 'utf8');
      this.db.sequelize.query(userQuery);

      const categoryQuery = fs.readFileSync('./seeders/product-category-seed.sql', 'utf8');
      this.db.sequelize.query(categoryQuery);

      const productQuery = fs.readFileSync('./seeders/product-seed.sql', 'utf8');
      this.db.sequelize.query(productQuery);

      const discountQuery = fs.readFileSync('./seeders/discount-seed.sql', 'utf8');
      this.db.sequelize.query(discountQuery);
    });
      
    this.productRepo = this.db.sequelize.getRepository(Product);
    this.productCategoryRepo = this.db.sequelize.getRepository(ProductCategory);
    this.cartRepo = this.db.sequelize.getRepository(Cart);
    this.cartItemRepo = this.db.sequelize.getRepository(CartItem);
    this.orderRepo = this.db.sequelize.getRepository(Order);
    this.orderItemRepo = this.db.sequelize.getRepository(OrderItem);
    this.discountRepo = this.db.sequelize.getRepository(Discount);
  }

  async findAllProduct() {
    let data = null;

    try {
      data = await this.productRepo.findAll({include: this.productCategoryRepo});
      this.logger.info('successfully get all product', null);
    } catch (err) {
      this.logger.error('Error in findAllProduct', err);
    }

    return data;
  }

  async findProductByCategoryId(categoryId) {
    let data = null;

    try {
      data = await this.productRepo.findAll({
        where: {categoryId: categoryId},
        include: this.productCategoryRepo
      });

    } catch (err) {
      this.logger.error('Error in findProductByCategory', err);
    }

    return data;
  }


  async findOrCreateCart(cartItem) {
    let data = null;

    try {
      const [cart, created] = await this.cartRepo.findOrCreate({
        where: {userId: cartItem.userId},
        defaults: {
          userId: cartItem.userId,
          totalPrice: cartItem.productPrice * cartItem.quantity,
        }
      });
      
      if (created) {
        this.logger.info('Cart created', null);
      }

      data = {
        ...cart.dataValues,
        created: created
      }

      this.logger.info('find or create Cart from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findOrCreateCart', err);
    }

    return data;
  }

  async findCartById(cartId) {
    let data = null;

    try {
      data = await this.cartRepo.findOne({
        where: {id: cartId},
        include: [
          {
            model: this.cartItemRepo,
            include: [
              this.productRepo
            ]
          }
        ]
      });
      this.logger.info('Get Cart from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findCartById', err);
    }

    return data;
  }

  async findCartByUserId(userId) {
    let data = null;

    try {
      data = await this.cartRepo.findOne({
        where: {userId: userId},
        include: [
          {
            model: this.cartItemRepo,
            include: [
              this.productRepo
            ]
          }     
        ]
      });
      this.logger.info('Get Cart from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findCartByUserId', err);
    }

    return data;
  } 

  async updateCart(cart) {
    let data = null;

    try {
      const cartId = await this.cartRepo.update(cart, {
        where: {id: cart.id}
      });

      data = {
        id: cartId,
      }

      this.logger.info('Update Cart in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in updateCart', err);
    }

    return data;
  }

  async deleteCart(cartId) {
    let data = null;

    try {
      data = await this.cartRepo.destroy({
        where: {id: cartId}
      });

      this.logger.info('Delete Cart in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in deleteCart', err);
    }

    return data;
  }

  async createCartItem(cartItem) {
    let data = null;

    try {
      data = await this.cartItemRepo.create(cartItem);
      this.logger.info('Create CartItem in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in createCartItem', err);
    }

    return data;
  }

  async findCartItemsByCartId(cartId) {
    let data = null;

    try {
      data = await this.cartItemRepo.findAll({
        where: {cartId: cartId}
      });
      this.logger.info('Get CartItem from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findCartItemByCartId', err);
    }

    return data;
  }

  async updateCartItem(cartItem) {
    let data = null;

    try {
      data = await this.cartItemRepo.update(cartItem, {
        where: {id: cartItem.id}
      });

      this.logger.info('Update CartItem in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in updateCartItem', err);
    }

    return data;
  }

  async deleteCartItem(cartItemId) {
    let data = null;

    try {
      data = await this.cartItemRepo.destroy({
        where: {id: cartItemId}
      });

      this.logger.info('Delete CartItem in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in deleteCartItem', err);
    }

    return data;
  }

  async deleteCartItemByCartId(cartId) {
    let data = null;

    try {
      data = await this.cartItemRepo.destroy({
        where: {cartId: cartId}
      });

      this.logger.info('Delete CartItem in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in deleteCartItemByCartId', err);
    }

    return data;
  }

  async createOrder(cart, orderCart) {
    let data = null;

    try {
      data = await this.orderRepo.create({
        userId: cart.userId,
        totalPriceInCart: cart.totalPrice,
        totalPriceAfterDiscount: orderCart.totalPriceAfterDiscount,
        discountId: orderCart.discountId,
        address: orderCart.address,
      });
      this.logger.info('Create Order in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in createOrder', err);
    }

    return data;
  }

  async createOrderItem(orderItem) {
    let data = null;

    try {
      data = await this.orderItemRepo.bulkCreate(orderItem);
      this.logger.info('Create OrderItem in DB successfully', null);
    } catch (err) {
      this.logger.error('Error in createOrderItem', err);
    }

    return data;
  }

  async findOrderById(orderId) {
    let data = null;

    try {
      data = await this.orderRepo.findOne({
        where: {id: orderId},
        include: [
          {
            model: this.orderItemRepo,
            include: [
              this.productRepo
            ]
          },
          this.discountRepo
        ]
      });
      this.logger.info('Get Order from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findOrderById', err);
    }

    return data;
  }

  async findOrderByUserId(userId) {
    let data = null;

    try {
      data = await this.orderRepo.findAll({
        where: {userId: userId},
        include: [
          {
            model: this.orderItemRepo,
            include: [
              this.productRepo
            ]
          },
          this.discountRepo
        ]
      });
      this.logger.info('Get Order from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in findOrderByUserId', err);
    }

    return data;
  }

  async findDiscountById(discountId) {
    let data = null;

    try {
      data = await this.discountRepo.findOne({
        where: {id: discountId}
      });
      this.logger.info('Get Discount from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in getDiscountById', err);
    }

    return data;
  }

  async findAllDiscount() {
    let data = null;

    try {
      data = await this.discountRepo.findAll();
      this.logger.info('Get Discount from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in getAllDiscount', err);
    }

    return data;
  }

  async findAllCategory() {
    let data = null;

    try {
      data = await this.productCategoryRepo.findAll();
      this.logger.info('Get Category from DB successfully', null);
    } catch (err) {
      this.logger.error('Error in getAllCategory', err);
    }

    return data;
  }
}