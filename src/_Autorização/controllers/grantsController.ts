import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import { IGrants, IGrantsController, IGrantsParams, IGrantsService } from "../Interfaces/grantsInterfaces";
import grantsService from "../services/grantsService";

class GrantsController implements IGrantsController {
    private grantsService: IGrantsService;
    private static instance: IGrantsController;

    /**
     * The constructor for the GrantsController.
     * It's private, so it can't be called from outside the class.
     * @param grantsService The service that will be used to interact with the grants.
     */
    private constructor(grantsService: IGrantsService) {
        this.grantsService = grantsService;
    }
    
    /**
     * Gets an instance of the GrantsController.
     * If the instance doesn't exist, it creates one using the provided grantsService.
     * This ensures a single instance (singleton pattern) of the GrantsController is used throughout the application.
     * @returns The instance of the GrantsController.
     */
    public static getInstance(): IGrantsController {
        if(!GrantsController.instance){
            GrantsController.instance = new GrantsController(grantsService);
        }
        return GrantsController.instance;
    }


    /**
     * Gets all grants.
     * @param {IHttpRequest} req - The request from the client.
     * @param {IHttpResponse} res - The response to the client.
     * @param {IHttpNext} next - The next function to call in the pipeline.
     * @returns {Promise<void>} A promise that resolves when the grants are found and sends them to the client, or rejects with an HttpError if the grants are not found.
     */
    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const grants = await this.grantsService.findAll();

            if(grants.length < 1){
                throw new HttpError(404, "Grants not found");
            }

            res.status(200).json(grants);
        }catch (error: any) {
            next(error);
        }
    }
    /**
     * Finds a grant by its id.
     * @param {IHttpRequest} req - The request from the client. The id of the grant must be in the params.
     * @param {IHttpResponse} res - The response to the client.
     * @param {IHttpNext} next - The next function to call in the pipeline.
     * @returns {Promise<void>} A promise that resolves when the grant is found and sends it to the client, or rejects with an HttpError if the grant is not found.
     */
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            
            const grant = await this.grantsService.findById(id);
            if(!grant){
                throw new HttpError(404, "Grant not found");
            }

            res.status(200).json(grant);
        } catch (error: any) {
            next(error);
        }
    }

        /**
         * Creates a new grant.
         * @param {IHttpRequest} req - The request from the client. The method, path and description of the grant must be in the body.
         * @param {IHttpResponse} res - The response to the client.
         * @param {IHttpNext} next - The next function to call in the pipeline.
         * @returns {Promise<void>} A promise that resolves when the grant is created and sends a message to the client, or rejects with an HttpError if the grant is not created.
         */
    async createGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const {method, path, description} = req.body

            if(!method || !path){
                throw new HttpError(409, "Method and path are required");
            }

            const grant: IGrantsParams = {
                method,
                path,
                description
            }

            const newGrants = await this.grantsService.createGrants(grant);

            if(!newGrants){
                throw new HttpError(400, "Grant already exists");
            }

            res.status(201).json(newGrants);
        } catch (error: any) {
            next(error);
        }
    }

        /**
         * Updates a grant.
         * @param {IHttpRequest} req - The request from the client. The id of the grant must be in the params and the fields to update must be in the body.
         * @param {IHttpResponse} res - The response to the client.
         * @param {IHttpNext} next - The next function to call in the pipeline.
         * @returns {Promise<void>} A promise that resolves when the grant is updated and sends a message to the client, or rejects with an HttpError if the grant is not updated.
         */
    async updateGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;
            const {method, path, description} = req.body
            
            if(!method && !path && !description){
                throw new HttpError(400, "No valid fields provided for update");
            }
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
        
            const grant: IGrantsParams = {
                method,
                path,
                description
            }
        
            const updatedGrants = await this.grantsService.updateGrants(id, grant);
        
            if(!updatedGrants){
                throw new HttpError(400, "Failed to update grants");
            }

            res.status(200).json(updatedGrants);
        } catch(error: any){
            next(error)
        }
    }

        /**
         * Deletes a grant.
         * @param {IHttpRequest} req - The request from the client. The id of the grant must be in the params.
         * @param {IHttpResponse} res - The response to the client.
         * @param {IHttpNext} next - The next function to call in the pipeline.
         * @returns {Promise<void>} A promise that resolves when the grant is deleted and sends a message to the client, or rejects with an HttpError if the grant is not deleted.
         */
    async deleteGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            await this.grantsService.deleteGrants(id);
            res.status(204).json({});
        } catch (error: any) {
            next(error);
        }
    }

        /**
         * Finds all profiles associated with a grant.
         * @param {IHttpRequest} req - The request from the client. The id of the grant must be in the params.
         * @param {IHttpResponse} res - The response to the client.
         * @param {IHttpNext} next - The next function to call in the pipeline.
         * @returns {Promise<void>} A promise that resolves when the profiles are found and sends them to the client, or rejects with an HttpError if the profiles are not found.
         */
    async getProfilesByGrantsId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            const grants = await this.grantsService.getProfilesByGrantsId(id);
            res.status(200).json(grants);
        } catch (error: any) {
            next(error);
        }
    }
}

export default GrantsController.getInstance();