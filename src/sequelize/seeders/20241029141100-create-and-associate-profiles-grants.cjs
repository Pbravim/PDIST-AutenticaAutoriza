const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const permissions = JSON.parse(fs.readFileSync(path.join(__dirname, '../../permissions.jsonc'), 'utf8'));
        
        const profiles = await queryInterface.sequelize.query(
          `SELECT id, name FROM profiles WHERE name IN ('UserComum', 'Admin');`,
          { type: Sequelize.QueryTypes.SELECT }
        );

        const profileIds = {};
        profiles.forEach(profile => {
            profileIds[profile.name] = profile.id;
        });

        for (const permission of permissions) {
            const [grant] = await queryInterface.bulkInsert('grants', [{
                id: uuidv4(),
                method: permission.method,
                path: permission.path,
                description: permission.description,
                createdAt: new Date(),
                updatedAt: new Date()
            }], { returning: true });

            const profileGrants = permission.profiles.map(profileName => ({
                profileId: profileIds[profileName],
                grantId: grant.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            await queryInterface.bulkInsert('grants_profiles', profileGrants, {});
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('grants_profiles', null, {});
        await queryInterface.bulkDelete('grants', null, {});
    }
};
