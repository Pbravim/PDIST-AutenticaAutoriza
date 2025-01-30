module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('profiles', {
          id: {
              type: Sequelize.STRING,
              primaryKey: true
          },
          name: {
              type: Sequelize.STRING,
              unique: true
          },
          description: {
              type: Sequelize.STRING,
              allowNull: true
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
      await queryInterface.dropTable('profiles');
  }
};
