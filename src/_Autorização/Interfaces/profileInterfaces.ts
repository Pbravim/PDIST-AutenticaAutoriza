import { IAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces"
import { IAppRouter } from "../../interfaces/appInterface"
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface"
import { IGrants } from "./grantsInterfaces"
/**
 * Represents a profile with its details.
 */
export interface IProfile {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Represents the parameters required to create or update a profile.
 */
export interface IProfileParams {
    name: string;
    description: string | null;
}

export interface IGrantProfile {
    grantId: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Repository interface for managing profiles.
 */
export interface IProfileRepository {
    /**
     * Retrieves all profiles.
     * @returns A promise that resolves to an array of profiles.
     */
    findAll(): Promise<IProfile[]>;

    /**
     * Retrieves a profile by its ID.
     * @param id - The ID of the profile to find.
     * @returns A promise that resolves to the profile if found, otherwise null.
     */
    findById(id: string): Promise<IProfile | null>;

    /**
     * Retrieves profiles by their IDs.
     * @param ids - An array of profile IDs.
     * @returns A promise that resolves to an array of profiles.
     */
    findByIds(ids: string[]): Promise<IProfile[]>;

    /**
     * Retrieves a profile by its name.
     * @param name - The name of the profile to find.
     * @returns A promise that resolves to the profile if found, otherwise null.
     */
    findByName(name: string): Promise<IProfile | null>;

    /**
     * Creates a new profile.
     * @param profileData - The profile data to create.
     * @returns A promise that resolves to the created profile, or null if creation fails.
     */
    createProfile(profileData: IProfile): Promise<IProfile | null>;

    /**
     * Updates an existing profile.
     * @param id - The ID of the profile to update.
     * @param updateData - The data to update the profile with.
     * @returns A promise that resolves to the updated profile.
     */
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile>;

    /**
     * Deletes a profile by its ID.
     * @param id - The ID of the profile to delete.
     * @returns A promise that resolves when the profile is deleted.
     */
    deleteProfile(id: string): Promise<void>;

    /**
     * Retrieves authentications associated with a profile.
     * @param profile - The profile to get authentications for.
     * @returns A promise that resolves to an array of authentications.
     */
    getAuthenticationsByProfileId(profile: IProfile): Promise<IAuthentication[]>;

    /**
     * Adds profiles to an authentication.
     * @param profiles - An array of profiles to add.
     * @param auth - The authentication to add profiles to.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfilesToAuthentication(profiles: IProfile[], auth: IAuthentication, options?: object): Promise<void>;

    /**
     * Removes profiles from an authentication.
     * @param profiles - An array of profiles to remove.
     * @param auth - The authentication to remove profiles from.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfilesFromAuthentication(profiles: IProfile[], auth: IAuthentication): Promise<void>;

    /**
     * Retrieves grants associated with a profile.
     * @param profile - The profile to get grants for.
     * @returns A promise that resolves to an array of grants.
     */
    getGrantsByProfileId(profile: IProfile): Promise<IGrants[]>;

    getGrantsByProfiles(profiles: IProfile[]): Promise<IGrants[]>

    /**
     * Adds a profile to multiple grants.
     * @param profile - The profile to add.
     * @param grants - An array of grants to add the profile to.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfileToGrants(profile: IProfile, grants: IGrants[]): Promise<void>;

    /**
     * Removes a profile from multiple grants.
     * @param profile - The profile to remove.
     * @param grants - An array of grants to remove the profile from.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfileFromGrants(profile: IProfile, grants: IGrants[]): Promise<void>;

}

/**
 * Service interface for managing profiles.
 */
export interface IProfileService {
    /**
     * Retrieves all profiles.
     * @returns A promise that resolves to an array of profiles.
     */
    findAll(): Promise<IProfile[]>;

    /**
     * Retrieves a profile by its ID.
     * @param id - The ID of the profile to find.
     * @returns A promise that resolves to the profile if found, otherwise null.
     */
    findById(id: string): Promise<IProfile | null>;

    /**
     * Creates a new profile.
     * @param profileData - The profile data to create.
     * @returns A promise that resolves when the profile is created, or null if creation fails.
     */
    createProfile(profileData: IProfileParams): Promise<IProfile>;

    /**
     * Updates an existing profile.
     * @param id - The ID of the profile to update.
     * @param updateData - The data to update the profile with.
     * @returns A promise that resolves when the profile is updated.
     */
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile>;

    /**
     * Deletes a profile by its ID.
     * @param id - The ID of the profile to delete.
     * @returns A promise that resolves when the profile is deleted.
     */
    deleteProfile(id: string): Promise<void>;

    /**
     * Retrieves authentications associated with a profile ID.
     * @param profileId - The profile ID to get authentications for.
     * @returns A promise that resolves to an array of authentications.
     */
    getAuthenticationsByProfileId(profileId: string): Promise<IAuthentication[]>;

    /**
     * Adds profiles to an authentication.
     * @param profilesId - An array of profile IDs to add.
     * @param userId - The user ID for the authentication.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfilesToAuthentication(profilesId: string[], userId: string, options?: object): Promise<void>;

    /**
     * Removes profiles from an authentication.
     * @param profilesId - An array of profile IDs to remove.
     * @param authId - The authentication ID to remove profiles from.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfilesFromAuthentication(profilesId: string[], authId: string): Promise<void>;

    /**
     * Retrieves grants associated with a profile ID.
     * @param profileId - The profile ID to get grants for.
     * @returns A promise that resolves to an array of grants.
     */
    getGrantsByProfileId(profileId: string): Promise<IGrants[]>;

    getGrantsByProfilesId(profilesId: string[]): Promise<IGrants[]>;
    /**
     * Adds a profile to multiple grants.
     * @param profileId - The profile ID to add.
     * @param grantsId - An array of grants IDs to add the profile to.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfileToGrants(profileId: string, grantsId: string[]): Promise<void>;

    /**
     * Removes a profile from multiple grants.
     * @param profileId - The profile ID to remove.
     * @param grantsId - An array of grants IDs to remove the profile from.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfileFromGrants(profileId: string, grantsId: string[]): Promise<void>;

}

/**
 * Controller interface for handling profile-related requests.
 */
export interface IProfileController {
    /**
     * Retrieves all profiles.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Retrieves a profile by its ID.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Creates a new profile.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    createProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Updates an existing profile.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    updateProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Deletes a profile by its ID.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    deleteProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Retrieves authentications associated with a profile.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    getAuthenticationsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Adds profiles to an authentication.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfilesToAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Removes profiles from an authentication.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfilesFromAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Retrieves grants associated with a profile.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    getGrantsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;


    /**
     * Adds a profile to multiple grants.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    addProfileToGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Removes a profile from multiple grants.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * @returns A promise that resolves when the operation is complete.
     */
    removeProfileFromGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

}

/**
 * Router interface for registering profile-related routes.
 */
export interface IProfileRouter {
    /**
     * Registers profile-related routes.
     * @param basePath - The base path for the routes.
     * @param app - The application router to register the routes with.
     */
    registerRoutes(basePath: string, app: IAppRouter): void;
}
