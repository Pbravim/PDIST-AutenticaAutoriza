import { IAppRouter } from "../../interfaces/appInterface"
import { IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface"
import { IProfile } from "./profileInterfaces"

/**
 * Interface that represents a grant
 * @interface
 */
export interface IGrants{
    /**
     * The id of the grant
     */
    id: string
    /**
     * The method of the grant
     */
    method: string
    /**
     * The path of the grant
     */
    path: string
    /**
     * The description of the grant
     */
    description: string | null
    /**
     * The creation date of the grant
     */
    createdAt: Date
    /**
     * The update date of the grant
     */
    updatedAt: Date
    /**
     * The profiles associated with the grant
     */
    grants_profiles?: IProfile[]
}

/**
 * Interface that represents the params to create a grant
 * @interface
 */
export interface IGrantsParams{
    /**
     * The method of the grant
     */
    method: string
    /**
     * The path of the grant
     */
    path: string
    /**
     * The description of the grant
     */
    description: string | null
}

/**
 * Interface that represents the repository of grants
 * @interface
 */
export interface IGrantsRepository{
    /**
     * Finds all grants
     * @returns {Promise<IGrants[]>}
     */
    findAll(): Promise<IGrants[]>
    /**
     * Finds a grant by id
     * @param {string} id - The id of the grant
     * @returns {Promise<IGrants | null>}
     */
    findById(id: string): Promise<IGrants | null> 
    /**
     * Finds a grant by method and path
     * @param {string} method - The method of the grant
     * @param {string} path - The path of the grant
     * @returns {Promise<IGrants | null>}
     */
    findByMethodAndPath(method: string, path: string): Promise<IGrants | null>
    /**
     * Finds grants by ids
     * @param {string[]} ids - The ids of the grants
     * @returns {Promise<IGrants[]>}
     */
    findByIds(ids: string[]): Promise<IGrants[]>
    /**
     * Creates a grant
     * @param {IGrantsParams} grantsData - The data of the grant
     * @returns {Promise<IGrants | null>}
     */
    createGrants(grantsData: IGrantsParams): Promise<IGrants | null>
    /**
     * Updates a grant
     * @param {string} id - The id of the grant
     * @param {Partial<IGrantsParams>} updateData - The data to update
     * @returns {Promise<IGrants | null>}
     */
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants | null>
    /**
     * Deletes a grant
     * @param {string} id - The id of the grant
     * @returns {Promise<void>}
     */
    deleteGrants(id: string): Promise<void>

    /**
     * Finds all profiles associated with a grant
     * @param {IGrants} grant - The grant
     * @returns {Promise<IProfile[]>}
     */
    getProfilesByGrantsId(grant: IGrants): Promise<IProfile[]>
}

/**
 * Interface that represents the service of grants
 * @interface
 */
export interface IGrantsService{
    /**
     * Finds all grants
     * @returns {Promise<IGrants[]>}
     */
    findAll(): Promise<IGrants[]>
    /**
     * Finds grants by ids
     * @param {string[]} ids - The ids of the grants
     * @returns {Promise<IGrants[]>}
     */
    findByIds(ids: string[]): Promise<IGrants[]>
    /**
     * Finds a grant by id
     * @param {string} id - The id of the grant
     * @returns {Promise<IGrants | null>}
     */
    findById(id: string): Promise<IGrants | null> 
    /**
     * Creates a grant
     * @param {IGrantsParams} grantsData - The data of the grant
     * @returns {Promise<void>}
     */
    createGrants(grantsData: IGrantsParams): Promise<IGrants>
    /**
     * Updates a grant
     * @param {string} id - The id of the grant
     * @param {Partial<IGrantsParams>} updateData - The data to update
     * @returns {Promise<IGrants>}
     */
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants>
    /**
     * Deletes a grant
     * @param {string} id - The id of the grant
     * @returns {Promise<IGrants>}
     */
    deleteGrants(id: string): Promise<void>

    /**
     * Finds all profiles associated with a grant
     * @param {string} grantId - The id of the grant
     * @returns {Promise<IProfile[]>}
     */
    getProfilesByGrantsId(grantId: string): Promise<IProfile[]>
}

/**
 * Interface that represents the controller of grants
 * @interface
 */
export interface IGrantsController{
    /**
     * Finds all grants
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Finds a grant by id
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>; 
    /**
     * Creates a grant
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    createGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Updates a grant
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    updateGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Deletes a grant
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    deleteGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>

    /**
     * Finds all profiles associated with a grant
     * @param {IHttpRequest} req - The request
     * @param {IHttpResponse} res - The response
     * @param {IHttpNext} next - The next function
     * @returns {Promise<void>}
     */
    getProfilesByGrantsId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
}

/**
 * Interface that represents the router of grants
 * @interface
 */
export interface IGrantsRouter{
    /**
     * Registers the routes of grants
     * @param {string} basePath - The base path of the router
     * @param {IAppRouter} app - The app instance
     * @returns {void}
     */
    registerRoutes(basePath: string, app: IAppRouter): void
}
