module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('grants', {
          id: {
              type: Sequelize.STRING,
              primaryKey: true
          },
          method: {
              type: Sequelize.STRING
          },
          path: {
              type: Sequelize.STRING
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
    
      await queryInterface.addConstraint('grants', {
        fields: ['method', 'path'],
        type: 'unique',
        name: 'unique_method_path' // Nome opcional para a constraint
    });

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('grants');
  }
};
