import User from '../models/user.js';


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

export default {getAllUsers};