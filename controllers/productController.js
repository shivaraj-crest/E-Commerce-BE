const {Product} = require('../models');
const {Category} = require('../models');
const {Brand} = require('../models');
const {Favorite}= require('../models');
const db = require('../models');
const { Op } = require('sequelize');

const addProduct = async (req, res, next) => {
    try {
        console.log("hellllllllll", req.body);
        const {name,description,price,rating,stock,category_id,brand_id} = req.body;

        if(!name || !description || !price || !rating || !stock  || !category_id || !brand_id){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        if(!req.files || req.files.length === 0){
            return res.status(400).json({
                message:"At least one image is required"
            })
        }


        const images = req.files.map(file => file.path);

        const existingProduct = await Product.findOne({
            where:{
                name:name,
            }
        })

        

        if(existingProduct){
            return res.status(400).json({
                message:"Product already exists"
            })
        }else{
            const product = await Product.create({name,description,price,rating,stock,category_id,brand_id,
                images:JSON.stringify(images)
            });
            res.status(201).json({
                message:"Product created successfully",
                product
            });

        }

    } catch (error) {
        next(error);
    }
}


const editProduct = async (req, res, next) => {
    try {
        const {id} = req.body;
        console.log("hellooooo",req.body)
        console.log("byeeeeeeeeeeeeeeeeeeeeeee",id)
        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })
        }

        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        const {name,description,price,rating,stock,quantity,category_id,brand_id} = req.body;

        if(!name || !description || !price || !rating || !stock || !category_id || !brand_id){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const updatedProduct = await product.update({name,description,price,rating,stock,quantity,category_id,brand_id});

        res.status(200).json({
            message:"Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        next(error);
    }
}


const deleteProduct = async (req, res, next) => {
    try {
        const {id} = req.query;

        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })
        }
        
        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        await product.destroy();

        res.status(200).json({
            message:"Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

const getAllProducts = async (req, res, next) => {
    try {
       
        const user_id = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page-1)*limit;

        const {category_id,brand_id,search,price_range,ratings,sort} = req.query;

        const whereClause = {};

        
        // ✅ Convert category_id to an array of numbers if it exists
        if (category_id && category_id !== "all") {
            // console.log("slkdfjsdlkfjsdklfjsdlkfjdslkfj",category_id)
            const categories = category_id.split(",").map(id => Number(id.trim())); // Convert to number array
            // console.log("categoriessdfffffffffffffffffffffffffff",categories)
            whereClause.category_id = { [db.Sequelize.Op.in]: categories };
        }

        // ✅ Convert brand_id to an array of numbers if it exists
        if (brand_id && brand_id !== "all") {
            const brands = brand_id.split(",").map(id => Number(id.trim())); // Convert to number array
            whereClause.brand_id = { [db.Sequelize.Op.in]: brands };
        }

        // ✅ Convert price_range (should be an array like `[minPrice, maxPrice]`)
        if (price_range) {
            
            const [minPrice, maxPrice] = price_range.split(",").map(id=>Number(id.trim()));
           
            whereClause.price = {
                [db.Sequelize.Op.gte]: minPrice,
                [db.Sequelize.Op.lte]: maxPrice,
            };
        }

        // ✅ Convert ratings to a number if provided
        if (ratings) {
            whereClause.rating = {
                [db.Sequelize.Op.gte]: Number(ratings),
            };
        }

        // ✅ Handle search functionality
        if (search) {
            whereClause[db.Sequelize.Op.or] = [
                { name: { [db.Sequelize.Op.like]: `%${search}%` } },
                { description: { [db.Sequelize.Op.like]: `%${search}%` } },
            ];
        }

         // ✅ Sorting Logic
         let orderClause = [['createdAt', 'DESC']]; // Default sorting

         if (sort === "1") {
             orderClause = [['price', 'DESC']]; // High to Low
         } else if (sort === "0") {
             orderClause = [['price', 'ASC']]; // Low to High
         }

      const {count,rows:products} = await Product.findAndCountAll({
        where:whereClause,
        limit,
        offset,
        include:[
            {
                model:Category,
                as:'category',

            },
            {
                model:Brand,
                as:'brand',
            },
            {
                model:Favorite,
                as:'favorites',
                attributes:['id'],
                where:{
                    user_id:user_id
                },
                required:false
            }
        ],
        order:orderClause
      })
      console.log("hhhhhhhhhhhhhhhhhhh")

    const formattedProducts = products.map((product) => ({
        ...product.toJSON(), // Remove Sequelize metadata we use findAndCountAll method 
        favourite: product.favourites?.length > 0, // Add favourite flag
        favouritesCount: product.favourites?.length ?? 0,
      }));

    //   console.log("FORMATTEDDATAAAAAAAAAAAAAAAAA",formattedProducts)


      res.status(200).json({
        message:"Products fetched successfully",
        products:formattedProducts,
        totalPages:Math.ceil(count/limit),
        currentPage:page,
        totalProducts:count,
        filters:{
            category_id :category_id || null,
            brand_id:brand_id || null,
            search:search || null,
            price_range:price_range || null,
            ratings:ratings || null,
            sort: sort || null
        },
      })
    } catch (error) {
        next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user_id = req.user.id;


        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })
        }

        const product = await Product.findByPk(id,{
            include:[
                {
                    model:Category,
                    as:'category',
                    
                },
                {
                    model:Brand,
                    as:'brand',
                },
                {
                    model:Favorite,
                    as:'favorites',
                    attributes:['id'],
                    where:{
                        user_id:user_id
                    },
                    required:false
                }
            ]
        });

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        const productJSON = product.toJSON();
        // let images = [];

        // try {
        //     if(productJSON.images){
        //         images = JSON.parse(productJSON.images);
        //     }
        // } catch (parseError) {
        //     console.error("Error parsing images JSON:", parseError);
        //     images = [];
        // }

        const formattedProduct = {
            ...productJSON,
            favourite:productJSON.favourites?.length > 0
        };

        res.status(200).json({
            message:"Product fetched successfully",
            product:formattedProduct
        })
    } catch (error) {
        next(error);
    }
}



module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
}