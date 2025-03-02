const {User,Favorite,Product,Category,Brand,Cart} = require('../models');


const getAllCategories = async(req,res,next)=>{
    try{
        const categories = await Category.findAll();

        res.status(200).json(categories);
    }catch(error){
        next(error);
    }
}

//products by category for filtering purposes
const getProductsByCategory = async(req,res,next)=>{
    try{
        const {id} = req.params;

        const products = await Product.findAll({
            where:{
                category_id : id
            },
            include:[
                {
                    model:Category,
                    as:"category"
                },
                // {
                //     model:User,
                //     as:"user"
                // }
            ]
        })


        res.status(200).json({
            message:"Products fetched successfully",
            products:products
        });


    }catch(error){
        next(error);
    }
}

//category wise products
const getAllCategoriesWithProducts = async(req,res,next)=>{
    try{
        const categories = await Category.findAll({
            include:[
                {
                    model:Product,
                    as:"products",
                    include:[
                        {
                            model:Brand,
                            as:"brand"
                        }
                    ]
                }
            ]
        });

        res.status(200).json({
            message:"Categories with products fetched successfully",
            categories:categories
        });
        

    }catch(error){
        next(error);
    }
}


const addCategory = async(req,res,next)=>{

    try{
        const {name} = req.body;

        const category = await Category.create({name});

        res.status(201).json({
            message:"Category created successfully",
            category:category
        });
        

    }catch(error){
        next(error);
    }

}

const updateCategory = async(req,res,next)=>{
    try{
        const {id} = req.body;
        const {name} = req.body;    

        const category = await Category.findByPk(id);

        if(!category){
            return res.status(404).json({
                message:"Category not found"
            });
        }

        category.name = name;
        await category.save();

        res.status(200).json({
            message:"Category updated successfully",
            category:category
        });
        

    }catch(error){
        next(error);
    }
}

const deleteCategory = async(req,res,next)=>{
    try{
        const {id} = req.query;
        const category = await Category.findByPk(id);

        if(!category){
            return res.status(404).json({
                message:"Category not found"
            });
        }

        await category.destroy();

        res.status(200).json({
            message:"Category deleted successfully"
        });
        
    }catch(error){
        next(error);
    }

}


module.exports = {
    getAllCategories,
    getProductsByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategoriesWithProducts
}