import express from "express";
import userController from "../controllers/userController";
import { authenticate, authorizeRole } from "../middlewear/authMiddlewear";
import checkDuplicateFields from "../middlewear/validateField";

const Router = express.Router();

Router.post("/register", checkDuplicateFields, userController.register);
Router.post("/login", userController.login);

Router.use(authenticate);

Router.use(authorizeRole("admin"));
Router.get("/all", userController.getAllUsers);

export default Router;