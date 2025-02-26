const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authenticate, authorizeRole } = require("../middlewear/authMiddlewear");
const checkDuplicateFields = require("../middlewear/validateField");

const Router = express.Router();

// Router.post("/register", checkDuplicateFields, authController.register);
// Router.post("/login", authController.login);

Router.use(authenticate);

Router.use(authorizeRole("admin"));
Router.get("/all", userController.getAllUsers);

module.exports = Router;