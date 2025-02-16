const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');
const upload = require('../middlewear/uploadMiddlewear');
const express = require('express');
const {getAllProducts,
    getProductById,
    addProduct,
    editProduct,
    deleteProduct
} = require('../controllers/productController');


const Router = express.Router();

Router.use(authenticate);

Router.get('/',getAllProducts)
Router.get('/:id',getProductById)


Router.get('/create',authorizeRole('admin'),upload.array("images",5),addProduct)
Router.put('/edit',authorizeRole('admin'),editProduct)
Router.delete('/',authorizeRole('admin'),deleteProduct)

module.exports = Router


