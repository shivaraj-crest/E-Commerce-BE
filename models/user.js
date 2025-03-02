'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CartProduct, {
        foreignKey: 'user_id',
        as: 'cart_products'
      });
      this.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders'
      });
      this.hasMany(models.OrderItem, {
        foreignKey: 'user_id',
        as: 'order_items'
      });
      this.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites'
      });
      this.hasMany(models.Address, {
        foreignKey: 'user_id',
        as: 'addresses'
      });
      // this.hasMany(models.Product,{
      //   foreignKey: 'user_id',
      // })
      
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    stripe_customer_id: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user'),
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });
  return User;
};