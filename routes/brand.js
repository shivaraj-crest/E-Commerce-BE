const express = require('express');
const Router = express.Router();

const {getAllBrands,
    getProductsByBrand,
    addBrand,
    updateBrand,
    deleteBrand,
} = require('../controllers/brandController');
const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');


// Public Routes
Router.get("/",getAllBrands);

// Protected Routes
Router.use(authenticate);

Router.post("/add",addBrand);
Router.put("/edit",updateBrand);
Router.delete("/delete",deleteBrand);

module.exports = Router;
