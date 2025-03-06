const {CartProduct} = require('../models');

//user route
const addProductToCart = async (req, res, next) => {
    try {
      const { product_id } = req.body;
      const user_id = req.user.id; // Get user ID from auth middleware
  
      // Check if product already exists in the user's cart
      let cartProduct = await CartProduct.findOne({
        where: { product_id, user_id }
      });
  
      if (cartProduct) {
        // If product exists, increase the quantity
        cartProduct.quantity += 1;
        await cartProduct.save(); // Save the updated quantity
      } else {
        // If product does not exist, create a new cart entry
        cartProduct = await CartProduct.create({
          product_id,
          user_id,
          quantity: 1
        });
      }
  
      res.status(201).json({
        message: "Product added to cart successfully",
        cartProduct
      });
    } catch (error) {
      next(error);
    }
  };
  
//user route
  const getCartProducts = async(req,res,next)=>{
    try{
        const user_id = req.user.id;
        
        const cartProducts = await CartProduct.findAll({
            where:{
                user_id:user_id
            },
            include:[
                {
                    model:Product,
                    as:"product"
                }
            ]
        });

        res.status(200).json({
            message:"Cart products fetched successfully",
            cartProducts:cartProducts
        });
        
        
    }catch(error){
        next(error);
    }
  } 

//user route
const deleteProductFromCart = async(req,res,next)=>{
    try{
        const {product_id} = req.body;
        const user_id = req.user.id;

        const cartProduct = await CartProduct.findOne({
            where:{
                product_id:product_id,
                user_id:user_id
            }
        });

        if(!cartProduct){
            return res.status(404).json({
                message:"Product not found in cart"
            });
        }

        await cartProduct.destroy();

        res.status(200).json({
            message:"Product removed from cart successfully"
        });
    }catch(error){
        next(error);
    }
}





  module.exports = {
    addProductToCart,
    getCartProducts,
    deleteProductFromCart
  }


  
