module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('grants_profiles', {
            grantId: {
                type: Sequelize.STRING,
                references: {
                    model: 'grants',
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
        await queryInterface.dropTable('grants_profiles');
    }
};
