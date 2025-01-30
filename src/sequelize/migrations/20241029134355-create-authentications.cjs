module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('authentications', {
          id: {
              type: Sequelize.STRING,
              primaryKey: true
          },
          login: {
              type: Sequelize.STRING,
              unique: true
          },
          passwordHash: {
              type: Sequelize.STRING
          },
          active: {
              type: Sequelize.BOOLEAN
          },
          password_token_reset: {
              type: Sequelize.STRING
          },
          password_token_expiry_date: {
              type: Sequelize.DATE
          },
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('authentications');
  }
};
