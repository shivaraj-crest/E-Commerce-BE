const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // Validate required fields
    if (!name || !email || !number || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required." });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: email,
      name: name,
      phone: number,
    });

    // Store user in database
    const user = await User.create({
      name,
      email,
      number,
      password: hashedPassword,
      image: req.file.path, // Cloudinary image URL
      stripe_customer_id: stripeCustomer.id, // Store Stripe Customer ID
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }

};


const login = async(req,res,next)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({
            where:{email},
        }) 
        
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token = jwt.sign({
            id:user.id, email:user.email, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"30d"}
        );

        res.status(200).json({
            message:"Login successful",
            token,
            user
        });

        
    }catch(error){
        next(error);
    }
}



module.exports = {
    register,
    login
};