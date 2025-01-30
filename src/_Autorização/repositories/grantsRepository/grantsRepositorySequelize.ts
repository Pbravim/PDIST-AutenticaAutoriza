import { models } from "../../../sequelize/models";
import GrantsModelSequelize from "../../../sequelize/models/grantsModelSequelize";
import { IGrants, IGrantsParams, IGrantsRepository } from "../../Interfaces/grantsInterfaces";
import { IProfile } from "../../Interfaces/profileInterfaces";
import Grants from "../../models/grantsModel";

class GrantsRepositorySequelize implements IGrantsRepository{
    
    /**
     * Retrieves all Grants in the database.
     * @returns A promise that resolves to an array of all Grants in the database.
     */
    async findAll(): Promise<IGrants[]> {
        return await models.grantsModelSequelize.findAll()
    }


    /**
     * Retrieves all Grants with the given ids from the database.
     * @param {string[]} ids - The ids of the Grants to retrieve.
     * @returns A promise that resolves to an array of all Grants with the given ids.
     */
    async findByIds(ids: string[]): Promise<IGrants[]> {
        return await models.grantsModelSequelize.findAll({where: {id: ids}})
    }


    /**
     * Retrieves a grant by its ID.
     * @param id - The ID of the grant to retrieve.
     * @returns A promise that resolves to the grant object if found, otherwise null.
     */
    async findById(id: string): Promise<IGrants | null> {
        return await models.grantsModelSequelize.findOne({where: {id: id}})
    }

    /**
     * Finds a grant by the specified HTTP method and path.
     * @param method - The HTTP method of the grant.
     * @param path - The path for which the grant is defined.
     * @returns A promise that resolves to the grant object if found, otherwise null.
     */
    async findByMethodAndPath(method: string, path: string): Promise<IGrants | null> {
        return await models.grantsModelSequelize.findOne({where: {method: method, path: path}})
    }


    /**
     * Creates a new grant.
     * @param grants - The grant object to be created.
     * @returns A promise that resolves to the created grant object, or null if creation fails.
     */
    async createGrants(grants: IGrants): Promise<IGrants | null> {
        return await models.grantsModelSequelize.create(grants)
    }


    /**
     * Updates a grant by its ID.
     * @param id - The ID of the grant to update.
     * @param updateData - The partial grant object containing the fields to update.
     * @returns A promise that resolves to the updated grant object if found, otherwise throws an error.
     */
    async updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants> {
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        )

        const [affectedCount, updatedRows] = await models.grantsModelSequelize.update(
            { ...filteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('Grants not found');
        }

        return updatedRows[0];
    }


    /**
     * Deletes a grant by its ID.
     * @param id - The ID of the grant to delete.
     * @returns A promise that resolves when the grant is deleted.
     */
    async deleteGrants(id: string): Promise<void> {
        await models.grantsModelSequelize.destroy({where: {id: id}});
    }

    /**
     * Gets the profiles associated with a grant.
     * @param grants - The grant for which to retrieve associated profiles.
     * @returns A promise that resolves to an array of profiles associated with the grant.
     */
    async getProfilesByGrantsId(grants: GrantsModelSequelize): Promise<IProfile[]> {
        return await grants.getProfiles();
    }
    
}

export default GrantsRepositorySequelize