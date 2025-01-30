import { v4 as uuidv4 } from 'uuid';
import { IGrants, IGrantsParams } from "../Interfaces/grantsInterfaces";

class Grants implements IGrants {
    id: string
    method: string
    path: string
    description: string | null
    profileList?: string[]
    createdAt: Date
    updatedAt: Date


    /**
     * Creates a new grant.
     * @param {IGrantsParams} {method, path, description} - The parameters to create the grant.
     * @param {string} method - The method of the grant (e.g. GET, POST, PUT, DELETE).
     * @param {string} path - The path of the grant.
     * @param {string | null} [description=null] - The description of the grant.
     */
    constructor({method, path, description = null} : IGrantsParams){
        this.validatePath(path);
        this.validateMethod(method);
        this.method = method;
        this.path = path;

        this.id = uuidv4();
        this.profileList = [];
        this.description = description;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }


    /**
     * Verifica se o parâmetro path é válido.
     * 
     * Ele precisa começar com uma barra "/" e conter apenas
     * caracteres alfanuméricos, underlines e hífens.
     * 
     * Caso contrário, uma exceção será lançada.
     * 
     * @param path - O path a ser verificado.
     * @throws {Error} Caso o path seja nulo ou inválido.
     */
    private validatePath(path: string): void {
        if (!path) {
            throw new Error('path é nulo');
        }
        const pathRegex = /^\/[a-zA-Z0-9\/_-]*$/;
        if (!pathRegex.test(path)) {
            throw new Error('path incorreto');
        }
    }


    /**
     * Verifica se o parâmetro method é válido.
     * 
     * Ele precisa ser um dos métodos HTTP padrão:
     * 
     * - GET
     * - POST
     * - PUT
     * - DELETE
     * - PATCH
     * - OPTIONS
     * - HEAD
     * 
     * Caso contrário, uma exceção será lançada.
     * 
     * @param method - O método a ser verificado.
     * @throws {Error} Caso o method seja nulo ou inválido.
     */
    private validateMethod(method: string): void {
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']

        if (!validMethods.includes(method.toUpperCase())) {
            throw new Error('metodo invalido');
        }
    }
}

export default Grants