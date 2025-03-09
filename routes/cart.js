const express = require('express');
const {authenticate} = require('../middlewear/authMiddlewear');
const Router = express.Router();
const {addProductToCart,
    getCartProducts,
    deleteProductFromCart
} = require('../controllers/cartController');

Router.use(authenticate);

Router.post('/add',addProductToCart);
Router.delete('/delete',deleteProductFromCart);
Router.get('/',getCartProducts);


module.exports = Router;