import { Model, DataTypes, Association, Sequelize } from "sequelize";
import { IAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces";
import  ProfileModelSequelize  from "./profileModelSequelize";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces";
import ExternalAuthenticationModelSequelize from "./externalAuthenticationModelSequelize";

class AuthenticationModelSequelize extends Model<IAuthentication> implements IAuthentication {
    public id!: string;
    public login!: string;
    public passwordHash!: string;
    public active!: boolean;
    public password_token_reset!: string | null;
    public password_token_expiry_date!: Date | null;
    public createdAt!: Date;
    public updatedAt!: Date;

    public getProfiles!: () => Promise<ProfileModelSequelize[]>
    public addProfiles!: (profiles: IProfile, options?: object) => Promise<void>

    public static associations: {
        profiles: Association<AuthenticationModelSequelize, ProfileModelSequelize>;
        externalAuthentications: Association<AuthenticationModelSequelize, ExternalAuthenticationModelSequelize>;
    };


    public static associate (models: any) {
        this.belongsToMany(ProfileModelSequelize, {
            through: "authentication_profiles",
            foreignKey: 'authenticationId',
            otherKey: 'profileId',
            as: 'profiles',
            onDelete: 'CASCADE'
        })

        this.hasMany(ExternalAuthenticationModelSequelize, {
            foreignKey: 'authentication_id',
            as: 'externalAuthentications',
            onDelete: 'CASCADE'
        })
    }

    public static initModel (sequelize: Sequelize) {
        AuthenticationModelSequelize.init({ 
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            login: {
                type: DataTypes.STRING
            },
            passwordHash: {
                type: DataTypes.STRING
            },
            active: {
                type: DataTypes.BOOLEAN
            },
            password_token_reset: {
                type: DataTypes.STRING
            },
            password_token_expiry_date: {
                type: DataTypes.DATE
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: 'authentications',
            modelName: 'AuthenticationModelSequelize',
            timestamps: false
        })
    }
}


export default AuthenticationModelSequelize