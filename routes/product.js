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


Router.post('/create',upload.array("images",5),addProduct)
Router.put('/edit',editProduct)

//is is sent in body
Router.delete('/delete',deleteProduct)

//keep /id below otherwise it would match with other routes like /create /edit, as create or would be 
//matched with :id
Router.get('/:id',getProductById)

module.exports = Router


