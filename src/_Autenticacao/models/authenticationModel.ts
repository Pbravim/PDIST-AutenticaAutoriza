import { v4 as uuidv4 } from 'uuid';
import { IAuthentication } from '../Interfaces/authInterfaces';



class Authentication implements IAuthentication { 
    id: string;
    login!: string;
    passwordHash!: string;
    active: boolean;
    password_token_reset!: string | null;
    password_token_expiry_date!: Date | null;
    createdAt: Date;
    updatedAt: Date;
    
    /**
     * Construtor da classe Authentication.
     * @param {{login: string, passwordHash: string}} params
     * @throws {Error} Caso o login ou passwordHash sejam nulos e isExternal seja false
     * @throws {Error} Caso o externalId seja nulo e isExternal seja true
     */
    constructor({login, passwordHash} : Partial<IAuthentication>){
        
        this.validateLoginCredentials(login, passwordHash);
        this.login = login!;
        this.passwordHash = passwordHash!;
        

        this.id = uuidv4()
        this.password_token_reset = null;
        this.password_token_expiry_date = null;
        this.active = true ;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }


    /**
     * Valida se o login ou passwordHash são nulos.
     * @param {string} login
     * @param {string} passwordHash
     * @throws {Error} Caso o login ou passwordHash sejam nulos
     * @private
     */
    private validateLoginCredentials(login: string | undefined, passwordHash: string | undefined): void {
        if (!login || !passwordHash) {
            throw new Error('login ou passwordHash são nulos');
        }
    }
}

export default Authentication;