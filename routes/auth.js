
import express from 'express';
import authController from '../controllers/authController';
import checkDuplicateFields from '../middlewear/validateField';
import { authenticate, authorizeRole } from '../middlewear/authMiddlewear';
import upload from '../middlewear/uploadMiddlewear';

const Router = express.Router();




Router.post('/register',upload.single('profile'),checkDuplicateFields,authController.register);
Router.post('/login',authController.login);

Router.use(authenticate);
Router.get("/admin", authorizeRole("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome Admin!" });
  });
  

  // Protected Route Example (Check if User is Regular User)
Router.get("/user", authorizeRole("user"), (req, res) => {
    res.status(200).json({ message: "Welcome User!" });
});



export default Router;
