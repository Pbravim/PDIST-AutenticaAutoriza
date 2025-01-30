import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IExternalAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces";
import AuthenticationModelSequelize from "./authenticationModelSequelize";


class ExternalAuthenticationModelSequelize extends Model<IExternalAuthentication> implements IExternalAuthentication {
    public external_id!: string;
    public authentication_id!: string;
    public email!: string;
    public provider!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: any) {
        this.belongsTo(AuthenticationModelSequelize, {
            foreignKey: 'authentication_id',
            as: 'authentication'
        })
    }

    public static associations: {
        authentication: Association<ExternalAuthenticationModelSequelize, AuthenticationModelSequelize>;
    }

    public static initModel(sequelize: Sequelize) {
        ExternalAuthenticationModelSequelize.init({
            external_id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            authentication_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            provider: {
                type: DataTypes.STRING
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: 'external_authentications',
            modelName: 'ExternalAuthenticationModelSequelize',
            timestamps: false
        });
    }
}

export default ExternalAuthenticationModelSequelize