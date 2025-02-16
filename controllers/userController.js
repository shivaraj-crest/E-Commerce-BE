const User = require('../models/user');


const getAllUsers = async (req,res,next)=>{
    try{
        const users = await User.findAll({
            where:{
                role:"user"
            },
            attributes:{
                exclude:["password"]
            }
        });
       return res.status(200).json({users});

    }catch(error){
        next(error);
    }
}

module.exports = {getAllUsers};