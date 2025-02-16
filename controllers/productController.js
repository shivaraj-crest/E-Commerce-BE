const Product = require('../models/product');

const addProduct = async (req, res, next) => {
    try {
        const {name,description,price,rating,stock,quantity,category_id,brand_id} = req.body;

        if(!name || !description || !price || !rating || !stock || !quantity || !category_id || !brand_id){
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

        const Product = await Product.findOne({
            where:{
                name:name,
            }
        })

        

        if(Product){
            return res.status(400).json({
                message:"Product already exists"
            })
        }else{
            const product = await Product.create({name,description,price,rating,stock,quantity,category_id,brand_id,
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

        if(!name || !description || !price || !rating || !stock || !quantity || !category_id || !brand_id){
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
        const {id} = req.body;

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

        const {category_id,brand_id,search,price_range,ratings} = req.query;

        const whereClause = {};

        if (category_id && category_id !== "all") {
            const categories = category_id.split(",").map((id) => id.trim());
            whereClause.category_id = { [db.Sequelize.Op.in]: categories };
          }

        if (brand_id && brand_id !== "all") {
            const brands = brand_id.split(",").map((id) => id.trim());
            whereClause.brand_id = { [db.Sequelize.Op.in]: brands };
          }

          if (price_range) {
            const [minPrice, maxPrice] = price_range.split(",").map(Number);
            whereClause.price = {
              [db.Sequelize.Op.gte]: minPrice,
              [db.Sequelize.Op.lte]: maxPrice,
            };
          }

           // Handle ratings filtering
    if (ratings) {
        whereClause.rating = {
          [db.Sequelize.Op.gte]: Number(ratings),
        };
      }
  
      // Add search functionality
      if (search) {
        whereClause[db.Sequelize.Op.or] = [
          {
            name: {
              [db.Sequelize.Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [db.Sequelize.Op.like]: `%${search}%`,
            },
          },
        ];
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
        order:[['createdAt','DESC']]
      })

      // Format the products to include images and favourite flag and remove sequelize metadata
      const formattedProducts = products.map((product) => {
        const productJSON = product.toJSON();
        let images = [];
  
        try {
          if (productJSON.images) {
            images = JSON.parse(productJSON.images);
          }
        } catch (parseError) {
          console.error("Error parsing images JSON:", parseError);
          images = [];
        }
  
        return {
          ...productJSON,
          images,
          favourite: productJSON.favourites.length > 0, // Add favourite flag
        };
      });




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
            ratings:ratings || null
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
        let images = [];

        try {
            if(productJSON.images){
                images = JSON.parse(productJSON.images);
            }
        } catch (parseError) {
            console.error("Error parsing images JSON:", parseError);
            images = [];
        }

        const formattedProduct = {
            ...productJSON,
            images,
            favourite:productJSON.favourites.length > 0
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