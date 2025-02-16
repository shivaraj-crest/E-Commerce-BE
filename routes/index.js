const express = require('express');
const Router = express.Router();

const authRouter = require('./auth.js');
const userRouter = require('./user.js');
const brandRouter = require('./brand.js');
const categoryRouter = require('./category.js');
const productRouter = require('./product.js');
const cartRouter = require('./cart.js');
const orderRouter = require('./order.js');



Router.use('/auth',authRouter);
Router.use('/user',userRouter);
Router.use('/brand',brandRouter);
Router.use('/category',categoryRouter);
Router.use('/product',productRouter);
Router.use('/cart',cartRouter);
Router.use('/order',orderRouter);


module.exports = Router;
