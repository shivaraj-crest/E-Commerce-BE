const {Address} = require('../models')

const getAllAddress = async(req,res,next)=>{
    try{
        const id = req.user.id
        
        if(!id){
            
 
            return res.status(400).json({
                message:"User id is required"
            })
        }
        
        const address = await Address.findAll({where:{user_id:id}});
   
        if(!address){
            return res.status(404).json({
                message:"Address not found"
            })
        }

        res.status(200).json({
            message:"Address fetched successfully",
            Address:address
        });

    }catch(error){
        next(error);
    }
}

module.exports = {
    getAllAddress,
}
