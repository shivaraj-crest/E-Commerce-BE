'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand'
      });
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      this.hasMany(models.Favorite, {
        foreignKey: 'product_id',
        as: 'favorites'
      });
      

    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    images:{
      type:DataTypes.TEXT,
      
      //This run whenever we're getting data from database and set runs when we're setting data
      //In database we're converting array to json string to store so when we get it we 
      //will parse it and convert it into array string.
      get() {
        return this.getDataValue("images") ? JSON.parse(this.getDataValue("images")) : [];
      },
    },
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    rating: DataTypes.ENUM('1','2','3','4','5'),
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};