const {CartProduct,Product} = require('../models');

//user route
const addProductToCart = async (req, res, next) => {
    try {
      const { product_id,value } = req.body;
      const user_id = req.user.id; // Get user ID from auth middleware
      console.log("helooooooooo",product_id,value)
      if(!product_id || value===null||undefined){
        return res.status(400).json({
          message:"product id and value both are required"
      })
      }
      // Check if product already exists in the user's cart
      let cartProduct = await CartProduct.findOne({
        where: { product_id, user_id }
      });
  
      if (cartProduct) {
        if(value){//if value is 1 then plus 1 the product
          cartProduct.quantity += 1;
          await cartProduct.save(); // Save the updated quantity
        }
        else{//if value is 0 then decrease the product item by one
          cartProduct.quantity -= 1;
          await cartProduct.save(); // Save the updated quantity
        }
       
      } else {
        // If product does not exist, create a new cart entry
        cartProduct = await CartProduct.create({
          product_id,
          user_id,
          quantity: 1
        });
      }
      
      if(value){
        res.status(201).json({
          message: "Product added to cart successfully",
          cartProduct
        });

      }
      else{
        res.status(201).json({
          message: "product quantity decreased by 1 successfully",
          cartProduct
        });
      }
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
        const {product_id} = req.query;
        const user_id = req.user.id;
        
        console.log("deleteeeeeeeeeeeeeeeeeeeeeeee",product_id,user_id);
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


  
