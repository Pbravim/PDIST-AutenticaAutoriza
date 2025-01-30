'use strict';

const { all } = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('external_authentications', {
      external_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      authentication_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      provider: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
    
    await queryInterface.addConstraint('external_authentications', {
      fields: ['external_id', 'authentication_id'],
      type: 'unique',
      name: 'unique_external_authentication'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('external_authentications', 'unique_external_authentication');
    await queryInterface.dropTable('external_authentications');
  }
};