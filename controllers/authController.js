const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password) {
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
      phone: mobile,
    });

    // Store user in database
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      image: req.file.path, // Cloudinary image URL
      stripe_customer_id: stripeCustomer.id, // Store Stripe Customer ID
      role:"user",
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }

};


const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        
      console.log("helllllllllllllo")
      console.log(email,password)
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
        console.log("hellooo",error);
    }
}


const adminVerify = async(req,res)=>{
  try {
    // Verify the token
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    // Fetch user details and check the role
    const user = await User.findByPk(decoded.userId); // Assuming user ID is stored in token
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // If everything is fine, send success
    res.json({ success: true, role: user.role });

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

}


module.exports = {
    register,
    login
};