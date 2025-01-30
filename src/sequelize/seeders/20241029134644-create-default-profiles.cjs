const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('profiles', [
          {
              id: process.env.USER_COMUM_PROFILE,
              name: 'UserComum',
              description: 'Perfil padrão de usuário comum',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              id: process.env.ADMIN_PROFILE,
              name: 'Admin',
              description: 'Perfil de administrador do sistema',
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ], {});
  },

  

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('profiles', {
          name: ['UserComum', 'Admin']
      }, {});
  }
};
