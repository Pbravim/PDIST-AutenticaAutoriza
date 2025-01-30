import { IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import { IProfileController, IProfileParams, IProfileService } from "../Interfaces/profileInterfaces";
import profileService from "../services/profileService";

class ProfileController implements IProfileController {
    private profileService: IProfileService;
    private static instance: IProfileController;

    /**
     * Private constructor for the ProfileController.
     * It is private because only the getInstance method should be able to create an instance of this class.
     * @param profileService The profile service to use.
     */
    private constructor(profileService: IProfileService) {
        this.profileService = profileService;
    }


    /**
     * Gets an instance of the ProfileController.
     * If the instance doesn't exist, it creates one with the given profileService.
     * @returns The instance of the ProfileController.
     */
    public static getInstance(): IProfileController {
        if(!ProfileController.instance){
            ProfileController.instance = new ProfileController(profileService);
        }
        return ProfileController.instance;
    }

/**
 * Retrieves all profiles and sends them in the response.
 * 
 * @param {IHttpRequest} req - The HTTP request object.
 * @param {IHttpResponse} res - The HTTP response object.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws an error if an issue occurs while retrieving profiles.
 */
    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const profiles = await this.profileService.findAll();
            
            res.status(200).json(profiles);
        }catch(error: any){
            next(error);
        }
    }
    /**
     * Retrieves a profile by its id and sends it in the response.
     * 
     * @param {IHttpRequest} req - The HTTP request object.
     * @param {IHttpResponse} res - The HTTP response object.
     * @param {IHttpNext} next - The next middleware function in the stack.
     * 
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * 
     * @throws {HttpError} Throws an error if an issue occurs while retrieving a profile.
     */
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        const { id } = req.params;
        try{
            const profile = await this.profileService.findById(id);
            if(!profile){
                throw new HttpError(404, "Profile not found");
            }
            res.status(200).json(profile);
        }catch(error: any){
            next(error);
        }
    }

    /**
     * Creates a new profile.
     * 
     * @param {IHttpRequest} req - The HTTP request object.
     * @param {IHttpResponse} res - The HTTP response object.
     * @param {IHttpNext} next - The next middleware function in the stack.
     * 
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * 
     * @throws {HttpError} Throws an error if an issue occurs while creating a profile.
     */
    async createProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { name, description } = req.body;

            if(!name){
                throw new HttpError(400, "Name is required");
            }

            const profile: IProfileParams = {
                name,
                description
            } 

            const newProfile = await this.profileService.createProfile(profile);
            
            res.status(201).json(newProfile);
        }catch(error: any){
            next(error);
        }
    }

    /**
     * Updates a profile.
     * 
     * @param {IHttpRequest} req - The HTTP request object.
     * @param {IHttpResponse} res - The HTTP response object.
     * @param {IHttpNext} next - The next middleware function in the stack.
     * 
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * 
     * @throws {HttpError} Throws an error if an issue occurs while updating a profile.
     */
    async updateProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;
            const {name, description} = req.body
            
            if(!name && !description){
                throw new HttpError(400, "No valid fields provided for update");
            }
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
        
            const profile: IProfileParams = {
                name,
                description
            }
        
            const updatedProfile = await this.profileService.updateProfile(id, profile);
        
            if(!updatedProfile){
                throw new HttpError(400, "Failed to update profile");
            }

            res.status(200).json(updatedProfile);
        } catch(error: any){
            next(error)
        }    
    }

    /**
     * Deletes a profile.
     * 
     * @param {IHttpRequest} req - The HTTP request object.
     * @param {IHttpResponse} res - The HTTP response object.
     * @param {IHttpNext} next - The next middleware function in the stack.
     * 
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * 
     * @throws {HttpError} Throws an error if an issue occurs while deleting a profile.
     */
    async deleteProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            await this.profileService.deleteProfile(id);
            res.status(204).json({})

        } catch (error: any) {
            next(error);
        }
    }
    
/**
 * Retrieves all authentications associated with a profile by its id and sends them in the response.
 * 
 * @param {IHttpRequest} req - The HTTP request object containing the profile id in the params.
 * @param {IHttpResponse} res - The HTTP response object to send the authentications.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws a 400 error if the id is not provided or a 404 error if the profile is not found.
 */
    async getAuthenticationsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;

            if(!id){
                throw new HttpError(400, "Id is required");
            }
            
            const authentications = await this.profileService.getAuthenticationsByProfileId(id);
            res.status(200).json(authentications);
        } catch(error: any){
            next(error);
        } 
    }

/**
 * Adds one or more profiles to an authentication by its id and sends a success message in the response.
 * 
 * @param {IHttpRequest} req - The HTTP request object containing the authentication id in the params and the profiles id in the body.
 * @param {IHttpResponse} res - The HTTP response object to send the success message.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws a 400 error if the id or profilesId is not provided or a 404 error if the authentication or profiles are not found.
 */
    async addProfilesToAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { authId } = req.params;
            const { profilesId } = req.body;
            
            if(!authId){
                throw new HttpError(400, "Id is required");
            }
             if(!Array.isArray(profilesId) || profilesId.length < 1){
                throw new HttpError(400, "ProfilesId is required");
            }
            await this.profileService.addProfilesToAuthentication(profilesId, authId);
            
            res.status(204).json({});
        } catch (error: any) {
            next(error);
        }
    }
/**
 * Removes one or more profiles from an authentication by its id and sends a success message in the response.
 * 
 * @param {IHttpRequest} req - The HTTP request object containing the authentication id in the params and the profiles id in the body.
 * @param {IHttpResponse} res - The HTTP response object to send the success message.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws a 400 error if the id or profilesId is not provided or a 404 error if the authentication or profiles are not found.
 */
    async removeProfilesFromAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { auth_id } = req.params;
            const { profilesId } = req.body;
            
            if(!auth_id){
                throw new HttpError(400, "Id is required");
            }   
            if(!Array.isArray(profilesId) || profilesId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }

            await this.profileService.removeProfilesFromAuthentication(profilesId, auth_id);
            res.status(204).json({})
        }catch(error: any){
            next(error);
        }
    }
/**
 * Retrieves all grants associated with a profile by its id and sends them in the response.
 * 
 * @param {IHttpRequest} req - The HTTP request object containing the profile id in the params.
 * @param {IHttpResponse} res - The HTTP response object to send the grants.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws a 400 error if the id is not provided or a 404 error if the profile is not found.
 */
    async getGrantsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            const grants = await this.profileService.getGrantsByProfileId(id);
            res.status(200).json(grants);

        } catch (error: any) {
            next(error);
        }
    }
/**
 * Adds a profile to a grant by its id and sends a success message.
 * 
 * @param {IHttpRequest} req - The HTTP request object containing the profile id in the params and the grants id in the body.
 * @param {IHttpResponse} res - The HTTP response object to send the success message.
 * @param {IHttpNext} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * 
 * @throws {HttpError} Throws a 400 error if the id or grants are not provided or a 404 error if the profile or grant is not found.
 */
    async addProfileToGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            const { grantsId } = req.body;
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
             if(!Array.isArray(grantsId) || grantsId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }
            await this.profileService.addProfileToGrants(id, grantsId);
            
            res.status(204).json({})
        } catch (error: any) {
            next(error);
        }
    }

        /** 
         * Removes a profile from a grant by its id and sends a success message.
         * 
         * @param {IHttpRequest} req - The HTTP request object containing the profile id in the params and the grants id in the body.
         * @param {IHttpResponse} res - The HTTP response object to send the success message.
         * @param {IHttpNext} next - The next middleware function in the stack.
         * 
         * @returns {Promise<void>} A promise that resolves when the operation is complete.
         * 
         * @throws {HttpError} Throws a 400 error if the id or grants are not provided or a 404 error if the profile or grant is not found.
         */
    async removeProfileFromGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            const { grantsId } = req.body;

            if(!id){
                throw new HttpError(400, "Id is required");
            }
            if(!Array.isArray(grantsId) || grantsId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }
            await this.profileService.removeProfileFromGrants(id, grantsId);
            res.status(204).json({})
        } catch (error: any) {
            next(error);
        }
    }

}

export default ProfileController.getInstance();