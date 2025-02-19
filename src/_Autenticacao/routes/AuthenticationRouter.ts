import authorize from "../../_Autorização/middlewares/authorize";
import {  IAppRouter } from "../../interfaces/appInterface";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { IAuthenticationController, IAuthenticationRouter } from "../Interfaces/authInterfaces";
import AuthenticationController from "../controllers/authenticationController";
import {authenticate} from "../middlewares/authenticate";
import { validateBodyChangePassword, validateBodyEmail, validateBodyExternalRegisterLogin, validateBodyPassword, validateBodyStandardRegisterLogin, validateBodyUpdateAuth, validateBodyUpdateGrants } from "../../utils/validationSchemas/bodyValidators";
import { validateParamId } from "../../utils/validationSchemas/paramValidators";


/**
 * @inheritdoc
 */
class AuthenticationRouter implements IAuthenticationRouter {
    private static instance: AuthenticationRouter;
    private authenticationController: IAuthenticationController;

    /**
     * Cria uma inst ncia da classe que implementa as rotas
     * de autentica o
     */
    constructor() {
        this.authenticationController = AuthenticationController;
    }

    public static getInstance(): AuthenticationRouter {
        if (!AuthenticationRouter.instance) {
            AuthenticationRouter.instance = new AuthenticationRouter();
        }
        return AuthenticationRouter.instance;
    }



    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /list:
         *   get:
         *      summary: Retornar a lista de autenticações do sistema
         *      description: Esta rota está disponível apenas para perfis de administrador.
         *      tags: 
         *          - [Autenticações]
         *      security:
         *          - BearerAuth: [] # Requer um token JWT
         *          - sessionAuth: [] # Requer um token de sessão
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      responses:
         *         200:
         *           description: Retorna a lista de autenticações do sistema
         *           content: 
         *              application/json:
         *                 schema:
         *                  type: array
         *                  items:
         *                    type: object
         *                    properties:
         *                      id:
         *                        type: string
         *                        example: "1111-2222-3333-4444"
         *                      login:
         *                        type: string | null
         *                        example: "admin@example.com"   
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         401:
         *           description: Erro de autenticação
         *         403:
         *           description: Permissão negada
         *         404:
         *           description: Erro ao retornar a lista
         *         500:
         *           description: Erro interno do servidor
         */
        app.get(`${basePath}/list`, authenticate, authorize, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findAll(req, res, next);
        })

        /**
         * @swagger
         * /me:
         *   get:
         *      summary: Retorna os dados da autenticação atual 
         *      description: Esta rota está disponível apenas para usuários autenticados.
         *      tags:
         *          - [Autenticações]
         *      security:
         *          - BearerAuth: [] # Requer um token JWT
         *          - sessionAuth: [] # Requer um token de sessão
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      responses:
         *         200:
         *           description: Retorna os dados da autenticação atual 
         *           content: 
         *              application/json:
         *                 schema:
         *                  type: object
         *                  properties:
         *                      id:
         *                        type: string
         *                        example: "1111-2222-3333-4444"
         *                      login:
         *                        type: string | null
         *                        example: "admin@example.com"  
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         401:
         *           description: usuario nao autenticado
         *         500:
         *           description: Erro interno do servidor 
         */
        app.get(`${basePath}/me`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findMe(req, res, next);
        })

        /**
         * @swagger
         * /externals/:id:
         *   get:
         *      summary: Retorna todas as autenticações externas de uma autenticação
         *      description: Esta rota está disponível apenas para usuários administradores.
         *      tags:
         *          - [Autenticações]
         *      security:
         *          - BearerAuth: [] # Requer um token JWT
         *          - sessionAuth: [] # Requer um token de sessão
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *          description: ID da autenticação
         *      responses:
         *         200:
         *           description: Retorna todas as autenticações externas de uma autenticação
         *           content: 
         *              application/json:
         *                 schema:
         *                  type: array
         *                  items:
         *                    type: object
         *                    properties:
         *                      external_id:
         *                        type: string
         *                        example: "1111ui2s546"
         *                      provider:
         *                        type: string
         *                        example: "google"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"        
         *         401:
         *           description: Erro de autenticação
         *         403:
         *           description: Erro de permissão
         *         404:
         *           description: Autenticação não encontrada
         *         500:
         *           description: Erro interno do servidor
         */
        app.get(`${basePath}/externals/:id`, authenticate, authorize, validateParamId, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findAllByAuthenticationId(req, res, next);
        })

        /**
         * @swagger
         * /:id:
         *   get:
         *      summary: Retorna os dados da autenticação pelo ID
         *      description: Esta rota está disponível apenas para usuários administradores.
         *      tags:
         *          - [Autenticações]
         *      security:
         *          - BearerAuth: [] # Requer um token JWT
         *          - sessionAuth: [] # Requer um token de sessão
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *          description: ID da autenticação
         *      responses:
         *         200:
         *           description: Retorna os dados da autenticação pelo ID
         *           content: 
         *              application/json:
         *                 schema:
         *                  type: object
         *                  properties:
         *                      id:
         *                        type: string
         *                        example: "1111-2222-3333-4444"
         *                      login:  
         *                        type: string | null
         *                        example: "admin@example.com"
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         401:
         *           description: Erro de autenticação
         *         403:
         *           description: Permissão negada
         *         404:
         *           description: Autenticação nao encontrada
         *         500:
         *           description: Erro interno do servidor
         */
        app.get(`${basePath}/:id`, authenticate, authorize, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findById(req, res, next);
        })

        /** 
         * @swagger
         * /:id/profiles:
         *  get:
         *      summary: Pegar os perfis com base no usuário
         *      description: Esta rota está disponível apenas para usuários administradores.
         *      tags: 
         *          - [Autenticações]
         *      servers:
         *          - url: http:localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *          description: ID do usuário
         *      responses:
         *         200:
         *           description: Retorna os perfis do usuário
         *         401:
         *           description: Erro de autenticação
         *         403:
         *           description: Permissão negada
         *         404:
         *           description: Usuário não encontrado
         *         500:
         *           description: Erro interno do servidor 
         */
        app.get(`${basePath}/:id/profiles`, authenticate, authorize, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.getProfilesByAuthentication(req, res, next);
        })
    }


    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /register:
         *   post:
         *      summary: Um usuário registra uma nova autenticação
         *      tags:
         *          - [Autenticações]
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *                  type: object
         *                  properties:
         *                      login:
         *                        type: string
         *                        example: "admin@example.com"
         *                      password:
         *                        type: string
         *                        example: "123456"
         *      responses:
         *         201:
         *           description: Autenticação criada com sucesso
         *           content:
         *              application/json:
         *                schema:
         *                  type: object
         *                  properties:
         *                      id:
         *                        type: string
         *                        example: "1111-2222-3333-4444"
         *                      login:  
         *                        type: string | null
         *                        example: "admin@example.com"
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         400:
         *           description: Erro de validação
         *         500:
         *           description: Erro interno do servidor
         */
        app.post(`${basePath}/register`, validateBodyStandardRegisterLogin, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.createAuthentication(req, res, next);
        });
    
        /**
         * @swagger
         * /login:
         *   post:
         *      summary: Autenticação de usuário
         *      tags:
         *          - [Autenticações]
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *                  type: object
         *                  properties:
         *                      login:
         *                        type: string
         *                        example: "admin@example.com"
         *                      password:
         *                        type: string
         *                        example: "123456"
         *      responses:
         *         200:
         *           description: Autenticação criada com sucesso
         *           content:
         *              application/json:
         *                schema:
         *                  type: object
         *                  properties:
         *                      tokenOrSessionId:
         *                        type: string
         *                        example: "1111-2222-3333-4444 | aksdlsaklgshfkhjsadv.adsjkhakd.asdald"
         *         400:
         *           description: Erro de validação
         *         500:
         *           description: Erro interno do servidor
         */
        app.post(`${basePath}/login`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.standartAuthenticate(req, res, next);
        });
    
        /**
         * @swagger
         * /authenticate/external:
         *   post:
         *      summary: Autenticação de usuário externo
         *      tags:
         *          - [Autenticações]
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *                  type: object
         *                  properties:
         *                      code:
         *                        type: string
         *                        example: "1111222233334444"
         *                      provider:
         *                        type: string
         *                        example: "google"
         *      responses:
         *         200:
         *           description: Autenticado com sucesso
         *         400:
         *           description: Campos invalidos
         *         500:
         *           description: Erro do servidor
         */
        app.post(`${basePath}/authenticate/external`, validateBodyExternalRegisterLogin, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.authenticateExternal(req, res, next);
        })

        /**
         * @swagger
         * /logout:
         *   post:
         *      summary: Realiza o logout do usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      responses:
         *         204:
         *           description: Logout realizado com sucesso
         *         401:
         *           description: Usuário não autenticado
         *         500:
         *           description: Erro interno do servidor
         */
        app.post(`${basePath}/logout`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.logout(req, res, next);
        });
        
        // /**
        //  * @swagger
        //  * /register/external:
        //  *   post:
        //  *      summary: Registra uma autenticação externa
        //  *      tags:
        //  *          - [Autenticações]
        //  *      servers:
        //  *          - url: http://localhost:3000/v1/auth
        //  *      requestBody:
        //  *        required: true
        //  *        content:
        //  *          application/json:
        //  *            schema:
        //  *              type: object
        //  *              properties:
        //  *                  code:
        //  *                    type: string
        //  *                  provider:
        //  *                    type: string
        //  *      responses:
        //  *         201:
        //  *           description: Autenticação criada com sucesso
        //  *         400:
        //  *           description: Erro de validação
        //  *         500:
        //  *           description: Erro interno do servidor
        //  */
        // app.post(`${basePath}/register/external`, validateBodyExternalRegisterLogin, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
        //     this.authenticationController.createExternalAuthentication(req, res, next);
        // })

        /**
         * @swagger
         * /me/add-external:
         *   post:
         *      summary: Adiciona uma autenticação externa ao usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  code:
         *                    type: string
         *                  provider:
         *                    type: string
         *      responses:
         *         201:
         *           description: Autenticação criada com sucesso
         *         400:
         *           description: Erro de validação
         *         500:
         *           description: Erro interno do servidor
         */
        app.post(`${basePath}/me/add-external`, authenticate, validateBodyExternalRegisterLogin,(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.addExternalAuthToAuthentication(req, res, next);
        })

        /**
         * @swagger
         * /forgot-password:
         *   post:
         *      summary: Solicita um e-mail de redefinição de senha
         *      tags:
         *          - [Autenticações]
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  login:
         *                    type: string
         *                    example: "admin@example.com"
         *      responses:
         *         204:
         *           description: Email enviado com sucesso
         *         400:
         *           description: Erro de validação
         *         404:
         *           description: Usuário nao encontrado
         *         500:
         *           description: Erro interno do servidor
         */
        app.post(`${basePath}/forgot-password`, validateBodyEmail,(req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.requestPasswordReset(req, res, next);
        });

        /**
         * @swagger
         * /validate-password:
         *   post:
         *      summary: Valida a senha do usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  password:
         *                    type: string
         *                    example: "123456"
         *      responses:
         *         200:
         *           description: Senha validada com sucesso
         *         400:
         *           description: Senha Invalida
         *         401:
         *           description: Usuário não autenticado
         *         500:
         *           description: Erro interno do servidor
         */ 
        app.post(`${basePath}/validate-password`, authenticate, validateBodyPassword,(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.validatePassword(req, res, next);
        });
    }


    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        
        /**
         * @swagger
         * /toggle-status/:id:
         *   put:
         *      summary: Ativa ou desativa um usuário
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *        - in: query
         *          name: toggle
         *          schema:
         *            type: boolean
         *          required: true
         *      responses:
         *         204:
         *           description: Usuário alterado com sucesso
         *         400:
         *           description: Erro de validação
         *         401:
         *           description: Usuário nao autenticado
         *         403:
         *           description: Usuário nao autorizado
         *         500:
         *           description: Erro interno do servidor
         */
        app.put(`${basePath}/toggle-status/:id`, authenticate, authorize, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.toggleAuthenticationStatus(req, res, next);
        });

        /**
         * @swagger
         * /update-password:
         *   put:
         *      summary: Atualiza a senha do usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  oldPassword:
         *                    type: string
         *                    example: "123456"
         *                  newPassword:
         *                    type: string
         *                    example: "123456789"
         *      responses:
         *         204:
         *           description: Usuário alterado com sucesso
         *         400:
         *           description: Erro de validação
         *         401:
         *           description: Usuário não autenticado
         *         500:
         *           description: Erro interno do servidor
         */
        app.put(`${basePath}/update-password`, 
            authenticate, 
            validateBodyChangePassword, 
            (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePassword(req, res, next);
        });
        
        /**
         * @swagger
         * /reset-password?token:
         *   put:
         *      summary: Reseta a senha do usuário com token fornecido pelo email
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: query
         *          name: token
         *          schema:
         *          type: string
         *          required: true
         *          description: Token enviado pelo email
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  password:
         *                    type: string
         *                    example: "123456789"
         *      responses:
         *         204:
         *           description: Senha alterada com sucesso
         *         400:
         *           description: Erro de validação
         *         403:
         *           description: Token inválido
         *         500:
         *           description: Erro interno do servidor
         */
        app.put(`${basePath}/reset-password`, validateBodyPassword, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePasswordReset(req, res, next);
        });

        /**
         * @swagger
         * /me:
         *   put:
         *      summary: Atualiza os dados do usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      requestBody:
         *        required: true
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  login:
         *                    type: string
         *                    example: "Admin@example.com"
         *      responses:
         *         200:
         *           description: Usuário alterado com sucesso
         *           content:
         *              application/json:
         *                schema:
         *                  type: object
         *                  properties:
         *                      id:
         *                        type: string
         *                        example: "11111111111111111111111111111111"
         *                      login:
         *                        type: string | null
         *                        example: "Admin@example.com"
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2023-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         400:
         *           description: Erro de validação
         *         401:
         *           description: Usuário não autenticado
         *         500:
         *           description: Erro interno do servidor
         */
        app.put(`${basePath}/me`, authenticate, validateBodyUpdateAuth, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateMyAuthentication(req, res, next);
        });
        

        /**
         * @swagger
         * /:id:
         *   delete:
         *      summary: Atualiza o usuário pelo id
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *          description: Id do usuário
         *      responses:
         *         200:
         *           description: Usuário alterado com sucesso
         *           content:
         *              application/json:
         *                schema:
         *                  type: object
         *                  properties:
         *                      id:
         *                        type: string
         *                        example: "11111111111111111111111111111111"
         *                      login:
         *                        type: string | null
         *                        example: "Admin@example.com"
         *                      active:
         *                        type: boolean
         *                        example: true
         *                      password_token_expiry_date:
         *                        type: string
         *                        example: "2023-01-01T00:00:00.000Z"
         *                      createdAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *                      updatedAt:
         *                        type: string
         *                        example: "2022-01-01T00:00:00.000Z"
         *         400:
         *           description: Erro de validação
         *         401:
         *           description: Usuário não autenticado
         *         403:
         *           description: Permissoes negada
         *         404:
         *           description: Usuário nao encontrado
         *         500: 
         *           description: Erro interno do servidor
         */
        app.put(`${basePath}/:id`, authenticate, authorize, validateParamId, validateBodyUpdateAuth, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateAuthentication(req, res, next);
        });
    }

    
    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /:id:
         *   delete:
         *      summary: Deleta o usuário autenticado
         *      tags:
         *          - [Autenticações]
         *      security:
         *        - bearerAuth: []
         *        - sessionAuth: []
         *      servers:
         *          - url: http://localhost:3000/v1/auth
         *      parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *          description: Id do usuário
         *      responses:
         *         200:
         *           description: Usuário deletado com sucesso
         *         401:
         *           description: Usuário não autenticado
         *         500:
         *           description: Erro interno do servidor
         */
        app.delete(`${basePath}/:id`, authenticate, authorize, validateParamId, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.deleteAuthentication(req, res, next);
        });

        app.delete(`${basePath}/gateway/:id`, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.deleteAuthentication(req, res, next);
        });
    }


    public registerRoutes(basePath: string, app: IAppRouter): void {
        this.registerRoutesGet(basePath, app);
        
        this.registerRoutesPost(basePath, app);

        this.registerRoutesPut(basePath, app);

        this.registerRoutesDelete(basePath, app);
    }
}

export default AuthenticationRouter.getInstance();



