
const express = require('express');
const authController = require('../controllers/authController');
const checkDuplicateFields = require('../middlewear/validateField');
const { authenticate, authorizeRole } = require('../middlewear/authMiddlewear');
const upload = require('../middlewear/uploadMiddlewear');
const {User} = require('../models');
const Router = express.Router();

Router.post('/register',upload.single('profile'),checkDuplicateFields,authController.register);
//add upload.none() is you're sending data as form data 
Router.post('/login',upload.none(),authController.login);

Router.use(authenticate);
//admin routes
Router.get("/admin",(req, res) => {
  res.status(200).json({ message: "Admin content",status:true });
});

  // Protected Route Example (Check if User is Regular User)
Router.get("/user",authorizeRole("user"),async (req, res) => {
  const {id} = req.query;

  if(!id) return res.status(400).json({message:"User id is required"});
  const user = await User.findOne({
    where:{
      id
    }
  })

  if(!user) return res.status(400).json({message:"User not found"});

  res.status(200).json({message:"Welcome User!",user});
});



module.exports = Router;
