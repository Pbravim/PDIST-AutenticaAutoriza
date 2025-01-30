'use strict';

const ADMIN_PROFILE = "4f7663fe-6fd8-42c9-ba1d-cd347859f817";
const bcrypt = require('bcrypt');
const  uuid4 = require('uuid4');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Inova123@', 10);

    await queryInterface.bulkInsert('authentications', [{
      id: uuid4(),
      login: 'admin@example.com',
      active: true,
      passwordHash: hashedPassword,
      password_token_reset: null,
      password_token_expiry_date: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const [authUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "authentications" WHERE login = 'admin@example.com';`
    );

    const authId = authUser[0]?.id; 

    await queryInterface.bulkInsert('authentication_profiles', [{
      profileId: ADMIN_PROFILE,
      authenticationId: authId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('authentication_profiles', {
      profileId: ADMIN_PROFILE
    }, {});

    await queryInterface.bulkDelete('authentications', {
      email: 'admin@example.com'
    }, {});
  }
};
