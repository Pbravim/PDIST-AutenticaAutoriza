import HttpError from "../../utils/customErrors/httpError";
import { IGrants, IGrantsParams, IGrantsRepository, IGrantsService } from "../Interfaces/grantsInterfaces";
import { IProfile, IProfileParams } from "../Interfaces/profileInterfaces";
import Grants from "../models/grantsModel";
import { createGrantsRepository } from "../repositories/factoryAuthorizationRepository";

/**
 * @inheritdoc
 * 
 * @class GrantsService
 * @implements {IGrantsService}
 */
class GrantsService implements IGrantsService{
    private static instance: GrantsService;
    private grantsRepository: IGrantsRepository;
    
    private constructor (grantsRepository: IGrantsRepository){ 
        this.grantsRepository = grantsRepository;
    }
    
    public static getInstance(): GrantsService {
        if(!GrantsService.instance){
            GrantsService.instance = new GrantsService(createGrantsRepository());
        }
        return GrantsService.instance;
    }
    
    async findAll(): Promise<IGrants[]> {
        return await this.grantsRepository.findAll();
    }
    async findByIds(ids: string[]): Promise<IGrants[]> {
        return await this.grantsRepository.findByIds(ids);
    }
    async findById(id: string): Promise<IGrants | null> {
        return await this.grantsRepository.findById(id);
    }

    async createGrants(grantsData: IGrantsParams): Promise<IGrants> {
        const grantExist = await this.grantsRepository.findByMethodAndPath(grantsData.method, grantsData.path);
        if (grantExist) {
            throw new HttpError(409, 'Grant already exists');
        }

        const grant = new Grants(grantsData)

        const newGrants = await this.grantsRepository.createGrants(grant);
    
        if (!newGrants) {
            throw new HttpError(400, 'Grant already exists');
        }
        
        return newGrants
    }

    async updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants> {
        const existingGrants = await this.grantsRepository.findById(id);

        if (!existingGrants) {
            throw new HttpError(404, 'Grants not found');
        }

        const filteredData = Object.entries(updateData)
            .filter(([_, value]) => value !== null && value !== undefined && 
                !(typeof value === 'string' && value.trim() === ''))
            .reduce((acc, [key, value]) => {
                acc[key as keyof IGrantsParams] = value as any;
                return acc;
            }, {} as Partial<IGrantsParams>);

        if (Object.keys(filteredData).length === 0) {
            throw new HttpError(400, 'No valid fields provided for update');
        }

        const updatedGrants = await this.grantsRepository.updateGrants(id, filteredData);
    
        if (!updatedGrants) {
            throw new HttpError(400, 'Failed to update grants');
        }

        return updatedGrants
    }

    async deleteGrants(id: string): Promise<void> {
        await this.grantsRepository.deleteGrants(id);
    }
    
    async getProfilesByGrantsId(grantId: string): Promise<IProfile[]> {
        const grants = await this.grantsRepository.findById(grantId);
        if (!grants) {
            throw new HttpError(404, 'Grants not found');
        }
        return await this.grantsRepository.getProfilesByGrantsId(grants);
    }
}

export default GrantsService.getInstance();