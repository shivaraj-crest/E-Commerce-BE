'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association herex
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(models.Address, {
        foreignKey: 'address_id',
        as: 'address'
      });
      this.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'order_items'
      });
      
    }
  }
  Order.init({
    payment_id: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    total_sub_amount: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    total_amount: DataTypes.FLOAT,
    total_items: DataTypes.INTEGER,
    total_quantity: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    payment_details: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};