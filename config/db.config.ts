import { Sequelize } from 'sequelize-typescript';
import { Cart, CartItem } from '../model/cart.model';
import { Discount } from '../model/discount.model';
import { Order, OrderItem } from '../model/order.model';
import { Product, ProductCategory } from '../model/product.model';
import { User } from '../model/user.model';

export const connect = () => {
  const hostName = process.env.HOST;
  const userName = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const database = process.env.DB;
  const timezone = process.env.TIMEZONE;
  const dialect: any = process.env.DIALECT;
  
  const operatorsAliases: any = false;

  const sequelize = new Sequelize(database, userName, password, {
    host: hostName,
    dialect,
    operatorsAliases,
    repositoryMode: true,
    timezone: timezone,
    dialectOptions: {
      useUTC: false,
      timezone: timezone
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000
    }
  });

  sequelize.addModels([Product, ProductCategory, Cart, CartItem, Order, OrderItem, User, Discount]);

  const db: any = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  return db;
}