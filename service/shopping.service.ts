import { Logger } from '../logger/logger';
import { ShoppingRepository } from '../repository/shopping.repository';

export class ShoppingService {
  private shoppingRepository: ShoppingRepository;
  private logger: Logger;

  constructor() {
    this.shoppingRepository = new ShoppingRepository();
    this.logger = new Logger();
  }

  async findAllProduct() {
    return await this.shoppingRepository.findAllProduct();
  }

  async findProductByCategoryId(categoryId) {
    return await this.shoppingRepository.findProductByCategoryId(categoryId);
  }

  async addItemToCart(cartItem: any) {
    let dataCart = await this.shoppingRepository.findOrCreateCart(cartItem);

    if (dataCart === null) {
      return null;
    }

    if (!dataCart.created) {
      dataCart = await this.shoppingRepository.updateCart({
        id: dataCart.id,
        totalPrice: dataCart.totalPrice + cartItem.productPrice * cartItem.quantity
      });

      if (dataCart === null) {
        return null;
      }
    }

    let dataCartItem = await this.shoppingRepository.createCartItem({
      ...cartItem,
      cartId: dataCart.id
    });
    
    if (dataCartItem === null) {
      return null;
    }

    let fullDataCart = await this.shoppingRepository.findCartByUserId(cartItem.userId);

    if (fullDataCart === null) {
      return null;
    }

    return fullDataCart;
  }

  async findCartByUserId(userId) {
    let dataCart = await this.shoppingRepository.findCartByUserId(userId);

    if (dataCart === null) {
      return null;
    }

    return dataCart;
  }

  async updateItemInCart(cartItem: any) {
    let updatedCartItemId = await this.shoppingRepository.updateCartItem(cartItem);
    if (updatedCartItemId === null) {
      return null;
    }

    let dataCartItems: any = await this.shoppingRepository.findCartItemsByCartId(cartItem.cartId);
    if (dataCartItems === null) {
      return null;
    }

    let totalPrice = 0;
    dataCartItems.forEach((item: any) => {
      totalPrice += item.productPrice * item.quantity;
    });

    let dataCart = await this.shoppingRepository.updateCart({
      id: cartItem.cartId,
      totalPrice: totalPrice
    });

    if (dataCart === null) {
      return null;
    }

    let fullDataCart = await this.shoppingRepository.findCartById(cartItem.cartId);

    if (fullDataCart === null) {
      return null;
    }

    return fullDataCart;
  }

  async deleteItemInCart(cartItem) {
    let isDeleted = await this.shoppingRepository.deleteCartItem(cartItem.id);
    if (isDeleted === null) {
      return null;
    }

    // the data hasn't existed in the cart item table
    if (isDeleted === 0) {
      return null;
    }

    let dataCartItems: any = await this.shoppingRepository.findCartItemsByCartId(cartItem.cartId);
    if (dataCartItems === null) {
      return null;
    }

    if (dataCartItems.length === 0) {
      let isDeleted = await this.shoppingRepository.deleteCart(cartItem.cartId);
      if (isDeleted === null) {
        return null;
      }

      return {};
    }

    let totalPrice = 0;
    dataCartItems.forEach((item: any) => {
      totalPrice += item.productPrice * item.quantity;
    });

    let dataCart = await this.shoppingRepository.updateCart({
      id: cartItem.cartId,
      totalPrice: totalPrice
    });

    if (dataCart === null) {
      return null;
    }

    let fullDataCart = await this.shoppingRepository.findCartById(cartItem.cartId);

    if (fullDataCart === null) {
      return null;
    }

    return fullDataCart;
    
  }

  async checkoutCart(orderCart) {
    let dataCart = await this.shoppingRepository.findCartById(orderCart.id);
    if (dataCart === null) {
      return null;
    }

    let dataDiscount = null;
    console.log(orderCart);
    console.log(orderCart.discountId);
    if (orderCart.discountId !== undefined) {
      dataDiscount = await this.shoppingRepository.findDiscountById(orderCart.discountId);
      
      if (dataDiscount === null) {
        return null;
      }
    } else {
      dataDiscount = {
        id: null,
        price: 0
      }
    }

    orderCart = {
      ...orderCart,
      totalPriceAfterDiscount: dataCart.totalPrice - dataDiscount.price
    }

    let dataOrder = await this.shoppingRepository.createOrder(dataCart, orderCart);
    if (dataOrder === null) {
      return null;
    }

    let dataCartItems = await this.shoppingRepository.findCartItemsByCartId(orderCart.id);
    if (dataCartItems === null) {
      return null;
    }

    let dataOrderItems = [];
    dataCartItems.forEach((item: any) => {
      dataOrderItems.push({
        orderId: dataOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
        productPrice: item.productPrice
      });
    });

    let dataOrderItemsCreated = await this.shoppingRepository.createOrderItem(dataOrderItems);
    if (dataOrderItemsCreated === null) {
      return null;
    }

    let finalDataOrder = await this.shoppingRepository.findOrderById(dataOrder.id);
    if (finalDataOrder === null) {
      return null;
    }

    await this.shoppingRepository.deleteCartItemByCartId(orderCart.id);
    await this.shoppingRepository.deleteCart(orderCart.id);

    return finalDataOrder;
  }

  async findOrderByUserId(userId) {
    let dataOrders = await this.shoppingRepository.findOrderByUserId(userId);
    if (dataOrders === null) {
      return null;
    }

    return dataOrders;
  }

  async findAllDiscount() {
    return await this.shoppingRepository.findAllDiscount();
  }

  async findAllCategory() {
    return await this.shoppingRepository.findAllCategory();
  }
}