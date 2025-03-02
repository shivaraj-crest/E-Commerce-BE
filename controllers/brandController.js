const {Brand,Product} = require('../models');



const getAllBrands = async(req,res,next)=>{
    try{
        const brands = await Brand.findAll();

        res.status(200).json({
            message:"Brands fetched successfully",
            brands:brands
        });

    }catch(error){
        next(error);
    }
}

const addBrand = async(req,res,next)=>{
    try{
        const {name} = req.body;
        const brand = await Brand.create({name});

        res.status(201).json({
            message:"Brand created successfully",
            brand:brand
        });
        

    }catch(error){
        next(error);
    }
}

const updateBrand = async(req,res,next)=>{
    try{
        const {id} = req.body;
        const {name} = req.body;

        const brand = await Brand.findByPk(id);

        if(!brand){
            return res.status(404).json({
                message:"Brand not found"
            });
        }

        await brand.update({name});

        res.status(200).json({
            message:"Brand updated successfully",
            brand:brand
        });

    }catch(error){
        next(error);
    }

}

const deleteBrand = async(req,res,next)=>{
    try{
        const {id} = req.body;
        
        const brand = await Brand.findByPk(id);

        if(!brand){
            return res.status(404).json({
                message:"Brand not found"
            });
        }

        await brand.destroy();

        res.status(200).json({
            message:"Brand deleted successfully"
        });
    }catch(error){
        next(error);
    }

}

module.exports = {
    getAllBrands,
    addBrand,
    updateBrand,
    deleteBrand
}

