'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      total_sub_amount: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      total_amount: {
        type: Sequelize.FLOAT
      },
      total_items: {
        type: Sequelize.INTEGER
      },
      total_quantity: {
        type: Sequelize.INTEGER
      },
      address_id: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      payment_details: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};