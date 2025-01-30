module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('authentication_profiles', {
          authenticationId: {
              type: Sequelize.STRING,
              references: {
                  model: 'authentications',
                  key: 'id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE'
          },
          profileId: {
              type: Sequelize.STRING,
              references: {
                  model: 'profiles',
                  key: 'id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE'
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
      await queryInterface.dropTable('authentication_profiles');
  }
};
