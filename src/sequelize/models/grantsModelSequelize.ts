import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IGrants } from "../../_Autorização/Interfaces/grantsInterfaces";
import ProfileModelSequelize  from "./profileModelSequelize";


class GrantsModelSequelize extends Model<IGrants> implements IGrants {
    id!: string;
    method!: string;
    path!: string;
    description!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
    
    public getProfiles!: () => Promise<ProfileModelSequelize[]>

    public static associations: { 
        profiles: Association<GrantsModelSequelize, ProfileModelSequelize> 
    };

    public static associate(models: any) {
        GrantsModelSequelize.belongsToMany(ProfileModelSequelize, {
            through: "grants_profiles",
            foreignKey: "grantId",
            otherKey: "profileId",
            as: "profiles"
        })
    }

    public static initModel (sequelize: Sequelize) {
        GrantsModelSequelize.init({ 
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            method: {
                type: DataTypes.STRING
            },
            path: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: "grants",
            modelName: "Grants",
            timestamps: false
        })
    }

}


export default GrantsModelSequelize