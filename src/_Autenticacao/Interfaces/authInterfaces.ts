import { IAppRouter } from "../../interfaces/appInterface";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces";

/**
 * Interface de autenticação para definir os dados necessários para
 * autenticação interna e externa de um usuário
 */
export interface IAuthentication {
    id: string;
    login: string;
    passwordHash: string;
    active: boolean;
    password_token_reset: string | null;
    password_token_expiry_date: Date | null;
    createdAt: Date;
    updatedAt: Date;
}


/**
 * Interface para o repositório de autenticação
 */
export interface IAuthenticationRepository {
    /**
     * Começa uma transação no database
     */
    startTransaction(): Promise<any>;
    /**
     * Cria uma autenticação
     * @param {IAuthentication} authData - Dados da autenticação
     * @returns {Promise<IAuthentication>} Usuário criado
     */
    createAuthentication(authData: IAuthentication, options?: object): Promise<IAuthentication>;
    /**
     * Atualiza uma autenticação
     * @param {string} id - Id da autenticação 
     * @param {PartialIAuthentication} updateData - Dados para atualizar 
     * @returns {Promise<IAuthentication>} Autenticação atualizada 
    */
    updateAuthentication(id: string, updateData: Partial<IAuthentication>): Promise<IAuthentication>;
    /**
     * Encontra uma autenticação pelo seu id
     * @param {string} id - Id da autenticação
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada 
     */
    findById(id: string): Promise<IAuthentication | null>;

    /**
     * Encontra uma autenticação pelo seu id
     * @param {string} id - Id da autenticação
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada 
     */
    findByIdWithPassword(id: string): Promise<IAuthentication | null>;

    /**
     * Encontra uma autenticação pelo seu token
     * @param {string} token - Token da autenticação
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada 
     */
    findByToken(token: string): Promise<IAuthentication | null>;
    /**
     * Encontra todas as autenticações no banco de dados
     * @returns {Promise<IAuthentication[] | null>} Lista de autenticações 
     */
    findAll(): Promise<IAuthentication[]>;
    /**
     * Encontra uma autenticação pelo seu login
     * @param {string} login - Login do usuário
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada
     */
    findByLogin(login: string, options?: object): Promise<IAuthentication | null>;

    /**
     * Deleta uma autenticação do banco de dados
     * @param {string} id - Id da autenticação
     * @returns {Promise<void>}
     */
    deleteAuthentication(id: string): Promise<void>;

    /**
     * Retorna os perfis associados a uma autenticação
     * @param {IAuthentication} auth - Autenticação
     * @returns {Promise<IProfile[]>} Perfis associados a autenticação
     */
    getProfilesByAuthentication(auth: IAuthentication): Promise<IProfile[]>
}

/**
 * Interface para o serviço de autenticação
 */
export interface IAuthenticationService  {
    /**
     * Encontra todas as autenticacoes no banco de dados.
     * @returns {Promise<IAuthentication[]>}
     */
    findAll(): Promise<IAuthentication[]>;
    /**
     * Encontra uma autenticação pelo seu token
     * @param {string} token - Token da autenticação
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada
     */
    findByToken(token: string): Promise<IAuthentication | null>;
    /**
     * Encontra uma autenticação pelo seu id
     * @param {string} id - Id da autenticação
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada
     */
    findById(id:string): Promise<IAuthentication | null>;
    /**
     * Encontra uma autenticação pelo seu login
     * @param {string} login - Login do usuário
     * @returns {Promise<IAuthentication | null>} Autenticação encontrada
     */
    findByLogin(login: string): Promise<IAuthentication | null>;
    /**
     * Cria uma autenticação interna
     * @param {IAuthentication} authData - Dados da autenticação, espera um login, uma senha, isExternal = false e externalId = null
     * @returns {Promise<IAuthentication | null>}
     */
    createStandartAuthentication(authData: Partial<IAuthentication>): Promise<IAuthentication>;
    /**
     * Atualiza uma autenticação
     * @param {string} id - Id da autenticação
     * @param {Partial<IAuthentication>} updateData - Dados para atualizar 
     * @returns {Promise<IAuthentication>}
     */
    updateAuthentication(id: string, updateData: Partial<IAuthentication>): Promise<IAuthentication>;
    /**
     * Ativa uma autenticação   
     * @param {string} id - Id da autenticação
     * @param {string} token - token que será validado
     * @returns {Promise<IAuthentication>}
     */
    isPasswordTokenValid(id: string, token: string): Promise<boolean>;
    /**
     * Verifica se uma senha é valida
     * @param {string} id - Id da autenticação
     * @param {string} passwordHash - Senha
     * @returns {Promise<boolean>}
     */
    validatePassword(id: string, passwordHash: string): Promise<boolean>;
    /**
     * Autentica um login e senha e retorna um JWT ou salva na sessão a depender do método utilizado
     * @param {string} login - Login do usuário
     * @param {string} passwordHash - Senha
     *  @returns {Promise<IAuthentication | null>} Autenticação encontrada
     */
    authenticate(login: string, passwordHash: string): Promise<IAuthentication | null>;
    /**
     * Atualiza a senha de uma autenticação
     * @param {string} id - Id da autenticação
     * @param {string} passwordHash - Senha
     * @returns {Promise<IAuthentication | null>}
     */
    updatePassword(id: string, passwordHash: string): Promise<void>;
    /**
     * Desativa uma autenticação
     * @param {string} id - Id da autenticação
     * @returns {Promise<void>}
     */
    deactivateAccountAuthentication(id: string): Promise<void>;
    /**
     * Ativa uma autenticação
     * @param {string} id - Id da autenticação
     * @returns {Promise<void>}
     */
    activateAccountAuthentication(id: string): Promise<void>;
    /**
     * Gera um token de redefinição de senha e o salva no banco de dados com validade de 1 hora
     * @param {string} id - Id da autenticação
     * @returns {Promise<string>}
     */
    setPasswordTokenAndExpiryDate(id: string): Promise<string>;
    /**
     * Deleta uma autenticação
     * @param {string} id - Id da autenticação
     * @returns {Promise<void>}
     */
    deleteAuthentication(id: string): Promise<void>;

    /**
     * Retorna os perfis associados a uma autenticação
     * @param {string} id - Id da autenticação
     * @returns {Promise<IProfile[] | null>}
     */
    getProfilesByAuthenticationId(id: string): Promise<IProfile[] | null>;

}


export interface IExternalAuthentication {
    authentication_id: string;
    external_id: string;
    email: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalAuthenticationRepository {
    findAll(): Promise<IExternalAuthentication[]>;
    findAllByProvider(provider: string): Promise<IExternalAuthentication[]>;
    findAllByAuthenticationId(authentication_id: string): Promise<IExternalAuthentication[]>;
    findByExternalId(external_id: string): Promise<IExternalAuthentication | null>;
    findByExternalIdAndProvider(external_id: string, provider: string): Promise<IExternalAuthentication | null>;
    createExternalAuthentication(externalAuthentication: IExternalAuthentication): Promise<IExternalAuthentication>;
    updateExternalAuthentication(externalAuthentication: IExternalAuthentication, filteredData: Partial<IExternalAuthentication>): Promise<IExternalAuthentication>;
    deleteExternalAuthentication(externalAuthentication: IExternalAuthentication): Promise<void>;
}

export interface IExternalAuthenticationService {
    findAll(): Promise<IExternalAuthentication[]>;
    findAllByAuthenticationId(authentication_id: string): Promise<IExternalAuthentication[]>;
    findAllByProvider(provider: string): Promise<IExternalAuthentication[]>;
    findByExternalId(id: string): Promise<IExternalAuthentication | null>;
    findByExternalIdAndProvider(external_id: string, provider: string): Promise<IExternalAuthentication | null>;
    createExternalAuthentication(externalAuthentication: Partial<IExternalAuthentication>): Promise<IExternalAuthentication>;
    updateExternalAuthentication(externalAuthentication: Partial<IExternalAuthentication>): Promise<IExternalAuthentication>;
    deleteExternalAuthentication(id: string): Promise<void>;
    addExternalToAuthentication({}:Partial<IExternalAuthentication>): Promise<IExternalAuthentication>;
}


/**
 * Interface para o controlador de autenticação
 */
export interface IAuthenticationController {
    /**
     * Retorna todas as autenticaçãos
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Retorna todas as autenticaçãos externas de uma autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    findAllByAuthenticationId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Encontra uma autenticação pelo id
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Encontra uma autenticação pelo usuário logado
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    findMe(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Cria uma autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    createAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Cria a autenticação e define interno e externo com base nos elementos do body
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    standartAuthenticate(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Atualiza uma autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    updateAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Atualiza a autenticação logada
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    updateMyAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Faz o pedido para redefinir a senha através do email
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    requestPasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Deleta uma autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    deleteAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Valida se a senha do usuario autenticado é a mesma do que o passado no body
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    validatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Atualiza a senha do usuário autenticado
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    updatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Atualiza o status da autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    toggleAuthenticationStatus(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Atualiza a senha do usuario pelo token enviado através do email
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica   
     * @param {IHttpNext} next - Proxima Função
     */
    updatePasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Realiza o logout do usuário autenticado
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    logout(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    /**
     * Recupera os perfis associados a uma autenticação
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    getProfilesByAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;

    // /**
    //  * Cria uma autenticação externa
    //  * @param {IHttpRequest} req - Requisição Genérica
    //  * @param {IHttpResponse} res - Resposta Genérica
    //  * @param {IHttpNext} next - Proxima Função
    //  */
    // createExternalAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    
    /**
     * Login com autenticação externa
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    authenticateExternal(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    /**
     * Adiciona uma autenticação externa a uma autenticação
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @param {IHttpResponse} res - Resposta Genérica
     * @param {IHttpNext} next - Proxima Função
     */
    addExternalAuthToAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
}

// INTERFACE DO ROUTER
/**
 * Interface de rotas de autenticação
 */
export interface IAuthenticationRouter{
    registerRoutes(basePath: string, app: IAppRouter): void;
}

/**
 * Interface de estrategia de autenticação
 */
export interface IAuthStrategy {
    /**
     * Realiza a autenticação de um usuário, com base na estratégia utilizada.
     * @param {IHttpRequest} req - Requisição Genérica
     * @param {Partial<IAuthentication>} auth - Autenticação
     * @returns {Promise<string>} Retorna uma string com informações da autenticação
     */
    authenticate(req: IHttpRequest,auth: Partial<IAuthentication>): Promise<string>;
    /**
     * Verifica se um token ou sessão existe e existe
     * @param {string} tokenOrSessionId - Token ou sessão
     * @returns {Promise<object | string>} Retorna um objeto com as informações da autenticação ou uma string com o erro
     */
    verify(tokenOrSessionId: string): Promise<object | string>;
    /**
     * Checa se o usuario está autenticado e se a autenticação é válida
     * @param {IHttpAuthenticatedRequest} req - Requisição Genérica de um usuário autenticado
     * @returns {Promise<object>} Retorna um objeto com as informações da autenticação
     */
    checkAuthentication(req: IHttpAuthenticatedRequest): Promise<object>;
}

export interface IOAuth2Strategy {
    getToken(code: string): Promise<string>;   
    getUserInfo(token: string): Promise<IOAuthUserInfo>;
}

export interface IOAuthUserInfo{
    data:{
        id: string,
        email: string
    }
}