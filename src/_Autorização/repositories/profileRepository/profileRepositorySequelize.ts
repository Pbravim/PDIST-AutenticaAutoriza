import { any } from "joi";
import { IAuthentication } from "../../../_Autenticacao/Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";
import AuthenticationModelSequelize from "../../../sequelize/models/authenticationModelSequelize";
import GrantsModelSequelize from "../../../sequelize/models/grantsModelSequelize";
import ProfileModelSequelize from "../../../sequelize/models/profileModelSequelize";
import { IGrants } from "../../Interfaces/grantsInterfaces";
import { IGrantProfile, IProfile, IProfileParams, IProfileRepository } from "../../Interfaces/profileInterfaces";
import { and, Op, QueryTypes } from "sequelize";

class ProfileRepositorySequelize implements IProfileRepository {
    async findAll(): Promise<IProfile[]> {
        return await models.profileModelSequelize.findAll();
    }

    async findById(id: string): Promise<IProfile | null> {
        return await models.profileModelSequelize.findByPk(id);
    }

    async findByIds(ids: string[]): Promise<IProfile[]> {
        return await models.profileModelSequelize.findAll({ where: { id: ids } });
    }

    async findByName(name: string): Promise<IProfile | null> {
        return await models.profileModelSequelize.findOne({ where: { name } });
    }

    async createProfile(profile: IProfile): Promise<IProfile | null> {
        return await models.profileModelSequelize.create(profile)
    }

    async updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile> {
        const FilteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        )
        
        const [affectedCount, updatedRows] = await models.profileModelSequelize.update(
            { ...FilteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('Profile not found');
        }

        return updatedRows[0];
    }

    async deleteProfile(id: string): Promise<void> {
        await models.profileModelSequelize.destroy({ where: { id } });
    }   

    async getAuthenticationsByProfileId(profile: ProfileModelSequelize): Promise<IAuthentication[]> {
        return await profile.getAuthentications({
            attributes: {exclude: ['passwordHash', 'password_token_reset']}
        });
    }


    async addProfilesToAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize, options?:object): Promise<void> {
        for (const profile of profiles) {
            await profile.addAuthentications(auth, options);
        }
    }
    
    async removeProfilesFromAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize): Promise<void> {
        for (const profile of profiles) {
            await profile.removeAuthentications(auth);
        }
    }



    async getGrantsByProfileId(profile: ProfileModelSequelize): Promise<GrantsModelSequelize[]> {
        const grants =  await profile.getGrants({
            attributes: ['id', 'method', 'path','description'],
            through: { attributes: [] }
        });

        return grants.map(grant => {
            const { grants_profiles, ...grantData } = grant.toJSON();
            return grantData as GrantsModelSequelize;
        });
    }

    async getGrantsByProfiles(profiles: IProfile[]): Promise<IGrants[]> {
        const profileIds = profiles.map(profile => profile.id);
    
        const profilesWithGrants = await models.profileModelSequelize.findAll({
            where: {
                id: profileIds
            },
            include: [{
                model: models.grantsModelSequelize,
                as: 'grants',
                through: { attributes: [] } // Exclui atributos da tabela intermediária
            }]
        });
    
        const grants = profilesWithGrants.flatMap((profile: any) => profile.grants);
    
        const uniqueGrantsMap = new Map<string, IGrants>();
        grants.forEach((grant: any) => {
            uniqueGrantsMap.set(grant.id, grant);
        });
    
        return Array.from(uniqueGrantsMap.values());
    }
    

    async addProfileToGrants(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.addGrants(grants);
    }

    async removeProfileFromGrants(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.removeGrants(grants);
    }

}

export default ProfileRepositorySequelize