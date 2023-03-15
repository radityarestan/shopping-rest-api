import { Logger } from '../logger/logger';
import { ShoppingService } from '../service/shopping.service';

export class ShoppingController {
  private shoppingService: ShoppingService;
  private logger: Logger;

  constructor() {
    this.shoppingService = new ShoppingService();
    this.logger = new Logger();
  }

  async findAllProduct() {
    return await this.shoppingService.findAllProduct();
  }

  async findProductByCategoryId(categoryId) {
    return await this.shoppingService.findProductByCategoryId(categoryId);
  }

  async addItemToCart(cartItem) {
    return await this.shoppingService.addItemToCart(cartItem);
  }

  async findCartByUserId(userId) {
    return await this.shoppingService.findCartByUserId(userId);
  }

  async updateItemInCart(cartItem) {
    return await this.shoppingService.updateItemInCart(cartItem);
  }

  async deleteItemInCart(cartItem) {
    return await this.shoppingService.deleteItemInCart(cartItem);
  }

  async checkoutCart(orderCart) {
    return await this.shoppingService.checkoutCart(orderCart);
  }

  async findOrderByUserId(userId) {
    return await this.shoppingService.findOrderByUserId(userId);
  }

  async findAllDiscount() {
    return await this.shoppingService.findAllDiscount();
  }

  async findAllCategory() {
    return await this.shoppingService.findAllCategory();
  }
}