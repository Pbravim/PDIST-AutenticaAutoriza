import { authenticate } from "../../_Autenticacao/middlewares/authenticate";
import { IAppRouter } from "../../interfaces/appInterface";
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import {  validateBodyListIds, validateBodyProfile, validateBodyUpdateProfile } from "../../utils/validationSchemas/bodyValidators";
import { validateParamId } from "../../utils/validationSchemas/paramValidators";
import profileController from "../controllers/profileController";
import { IProfileController, IProfileRouter } from "../Interfaces/profileInterfaces";
import authorize from "../middlewares/authorize";


/**
 * @inheritdoc
 */
class ProfileRouter implements IProfileRouter{
    private static instance: ProfileRouter
    private profileController: IProfileController
    
    constructor(profileController: IProfileController) {
        this.profileController = profileController;
    }

    public static getInstance(): ProfileRouter {
        if (!ProfileRouter.instance) {
            ProfileRouter.instance = new ProfileRouter(profileController);
        }
        return ProfileRouter.instance;
    }   

    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /profile/list:
         *   get:
         *     summary: Retorna a lista de perfis do sistema
         *     tags: 
         *       - [Profile]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     responses:
         *       200:
         *         description: Retorna a lista de perfis do sistema
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z" 
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/list`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.findAll(req, res, next);
        })


        /**
         * @swagger
         * /profile/:id:
         *   get:
         *     summary: Retorna um perfil específico pelo ID
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           description: ID do perfil
         *     responses:
         *       200:
         *         description: Retorna o perfil solicitado
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z" 
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/:id`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.findById(req, res, next);
        })
        
        /**
         * @swagger
         * /profile/:id/grants:
         *   get:
         *     summary: Retorna os grants associados a um perfil
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     responses:
         *       200:
         *         description: Retorna os grants associados ao perfil
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   method:
         *                     type: string
         *                     example: "GET || POST || PUT || DELETE"
         *                   path:
         *                     type: string
         *                     example: "/v1/auth/list"
         *                   description:
         *                     type: string
         *                     example: "Listagem de autenticação"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z" 
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/:id/grants`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.getGrantsByProfileId(req, res, next);
        })
        
        /**
         * @swagger
         * /profile/:id/authentications:
         *   get:
         *     summary: Retorna as autenticações associadas a um perfil
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     responses:
         *       200:
         *         description: Retorna as autenticações associadas ao perfil
         *         content:
         *           application/json:
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
         *                      isExternal:
         *                        type: boolean
         *                        example: false
         *                      externalId :
         *                        type: string | null
         *                        example: "1111ui2s546"    
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
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/:id/authentications`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.getAuthenticationsByProfileId(req, res, next);
        })
    }
 

    private registerRoutesPost(basePath: string, app: IAppRouter): void {

                /**
         * @swagger
         * /profile/create:
         *   post:
         *     summary: Cria um novo perfil
         *     tags:
         *       - [Profile]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *     responses:
         *       201:
         *         description: Perfil criado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z" 
         *       400:
         *         description: Requisição inválida
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       500:
         *         description: Erro interno do servidor
         */
        app.post(`${basePath}/create`, validateBodyProfile, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.createProfile(req, res, next);
        })
    }

    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        
        /**
         * @swagger
         * /profile/:id:
         *   put:
         *     summary: Atualiza um perfil existente
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *     responses:
         *       200:
         *         description: Perfil atualizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z" 
         *       400:
         *         description: Requisição inválida
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:id`, validateParamId, validateBodyUpdateProfile,(req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.updateProfile(req, res, next);
        })


        /**
         * @swagger
         * /profile/:id/add-grants:
         *   put:
         *     summary: Adiciona um ou mais permissões a um perfil existente
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     requestBody:
         *       required: true 
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: string
         *                 example: "1111-2222-3333-4444"
         *     responses:
         *       200:
         *         description: Grants adicionados com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *       400:
         *         description: Requisição inválida
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil ou grant nao encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:id/add-grants`, validateParamId, validateBodyListIds, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.addProfileToGrants(req, res, next);
        })


        /**
         * @swagger 
         * /profile/:authId/add-profiles:
         *   put:
         *     summary: Adiciona um ou mais perfis a uma autenticação existente
         *     tags:    
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: authId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da autenticação
         *     requestBody:
         *       required: true 
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: string 
         *                 example: "1111-2222-3333-4444"
         *     responses:
         *       200:
         *         description: Perfil adicionado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: "1111-2222-3333-4444"
         *                   name:
         *                     type: string
         *                     example: "Admin"
         *                   description:
         *                     type: string
         *                     example: "Administrador do sistema"
         *                   createdAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *                   updatedAt:
         *                     type: string
         *                     example: "2023-01-01T00:00:00.000Z"
         *       400:
         *         description: Requisição inválida
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil ou autenticação nao encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:authId/add-profiles`, validateBodyListIds,(req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.addProfilesToAuthentication(req, res, next);
        })


        /**
         * @swagger
         * /profile/:id/remove-grants:
         *   put:
         *     summary: Remove um ou mais permissões de um perfil existente
         *     tags:    
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     requestBody:
         *       required: true 
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: string 
         *                 example: "1111-2222-3333-4444"
         *     responses:
         *       204:
         *         description: Perfil excluído com sucesso
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil ou grant não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:id/remove-grants`, validateParamId, validateBodyListIds,(req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.removeProfileFromGrants(req, res, next);
        })


        /**
         * @swagger
         * /profile/:authId/remove-profiles:
         *   put:
         *     summary: Remove um ou mais perfis de uma autenticação existente
         *     tags:    
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: authId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da autenticação
         *     requestBody:
         *       required: true 
         *       content:
         *         application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: string 
         *                 example: "1111-2222-3333-4444"
         *     responses:
         *       204:
         *         description: Perfis removidos com sucesso
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil ou autenticação nao encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:authId/remove-profiles`, validateBodyListIds, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.removeProfilesFromAuthentication(req, res, next);
        })
    }

    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /profile/:id:
         *   delete:
         *     summary: Exclui um perfil existente
         *     tags:
         *       - [Profile]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do perfil
         *     responses:
         *       204:
         *         description: Perfil excluído com sucesso
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Perfil não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.delete(`${basePath}/:id`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.deleteProfile(req, res, next);
        })
    }

    public registerRoutes(basePath: string, app: IAppRouter): void {
        app.use(basePath, authenticate, authorize);

        this.registerRoutesGet(basePath, app);
        this.registerRoutesPost(basePath, app);
        this.registerRoutesPut(basePath, app);
        this.registerRoutesDelete(basePath, app);
    }

}

export default ProfileRouter.getInstance();