const express = require('express');
const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');
const Router = express.Router();
const {getAllCategories,
    getProductsByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategoriesWithProducts
} = require('../controllers/categoryController');

// Public Routes
Router.get("/", getAllCategories);  // GET all categories
Router.get("/:id/products", getProductsByCategory); //products by category for filtering purposes
Router.get("/products", getAllCategoriesWithProducts); // GET all categories wise products


// Protected Routes (Authentication Required)
Router.use(authenticate);

Router.post("/create", addCategory);  // Admin-only: Create category

Router.put("/edit",updateCategory); // Admin-only: Update category
Router.delete("/delete", deleteCategory); // Admin-only: Delete categor


module.exports = Router;
