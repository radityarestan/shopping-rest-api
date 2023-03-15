import * as express from 'express';
import * as bodyParser from 'body-parser';

import 'dotenv/config';

import { Logger } from './logger/logger';
import { ShoppingController } from './controller/shopping.controller';

class App {
  public express: express.Application;
  public logger: Logger;
  public shoppingController: ShoppingController;

  constructor() {
    this.express = express();
    this.middleware();
    this.mountRoutes();

    this.logger = new Logger();
    this.shoppingController = new ShoppingController();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private mountRoutes(): void {
    this.express.get('/api/v1/shop', (req, res) => {
      let categoryId = req.query.categoryId;

      if (categoryId) {
        this.shoppingController.findProductByCategoryId(categoryId).then((data) => {
          res.json(data);
        });
      } else {
        this.shoppingController.findAllProduct().then((data) => {
          res.json(data);
        });
      }
    });

    this.express.post('/api/v1/shop/cart', (req, res) => {
      this.shoppingController.addItemToCart(req.body).then((data) => {
        res.json(data);
      });
    });

    this.express.get('/api/v1/shop/cart/:userId', (req, res) => {
      this.shoppingController.findCartByUserId(req.params.userId).then((data) => {
        res.json(data);
      });
    });

    this.express.put('/api/v1/shop/cart-item', (req, res) => {
      this.shoppingController.updateItemInCart(req.body).then((data) => {
        res.json(data);
      });
    });

    this.express.delete('/api/v1/shop/cart-item', (req, res) => {
      this.shoppingController.deleteItemInCart(req.body).then((data) => {
        res.json(data);
      });
    });

    this.express.post('/api/v1/shop/checkout-cart', (req, res) => {
      this.shoppingController.checkoutCart(req.body).then((data) => {
        res.json(data);
      });
    });

    this.express.get('/api/v1/shop/order/:userId', (req, res) => {
      this.shoppingController.findOrderByUserId(req.params.userId).then((data) => {
        res.json(data);
      })
    });

    this.express.get('/api/v1/shop/discount', (_, res) => {
      this.shoppingController.findAllDiscount().then((data) => {
        res.json(data);
      })
    });

    this.express.get('/api/v1/shop/category', (_, res) => {
      this.shoppingController.findAllCategory().then((data) => {
        res.json(data);
      })
    });

    this.express.use("*", (_, res, __) => {
      res.status(404);
      res.send("Route not found");
  });
  }
}

export default new App().express;