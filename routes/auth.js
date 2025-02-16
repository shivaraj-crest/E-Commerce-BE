
const express = require('express');
const authController = require('../controllers/authController');
const checkDuplicateFields = require('../middlewear/validateField');
const { authenticate, authorizeRole } = require('../middlewear/authMiddlewear');
const upload = require('../middlewear/uploadMiddlewear');
const Router = express.Router();

Router.post('/register',upload.single('profile'),checkDuplicateFields,authController.register);
//add upload.none() is you're sending data as form data 
Router.post('/login',upload.none(),authController.login);

Router.use(authenticate);
Router.get("/admin", authorizeRole("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome Admin!" });
  });
  

  // Protected Route Example (Check if User is Regular User)
Router.get("/user", authorizeRole("user"), (req, res) => {
    res.status(200).json({ message: "Welcome User!" });
});



module.exports = Router;
