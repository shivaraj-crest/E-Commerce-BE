'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  OrderItem.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};