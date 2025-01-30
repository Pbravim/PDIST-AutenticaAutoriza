import { IAppRouter } from "../../interfaces/appInterface";
import grantsController from "../controllers/grantsController";
import { IGrants, IGrantsController, IGrantsRouter } from "../Interfaces/grantsInterfaces";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { authenticate } from "../../_Autenticacao/middlewares/authenticate";
import authorize from "../middlewares/authorize";
import { validateParamId } from "../../utils/validationSchemas/paramValidators";
import { validateBodyGrants, validateBodyUpdateGrants } from "../../utils/validationSchemas/bodyValidators";

class GrantsRouter implements IGrantsRouter{
    private grantsController: IGrantsController;
    private static instance: IGrantsRouter;

    private constructor(grantsController: IGrantsController) {
        this.grantsController = grantsController;
    }

    public static getInstance(): IGrantsRouter {
        if(!GrantsRouter.instance){
            GrantsRouter.instance = new GrantsRouter(grantsController);
        }
        return GrantsRouter.instance;
    }


    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /grants/list:
         *   get:
         *     summary: Retorna a lista de grants do sistema
         *     tags: 
         *       - [Grants]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     servers:
         *       - url: http://localhost:3000/v1/grants
         *     responses:
         *       200:
         *         description: Retorna a lista de grants do sistema
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
         *       400:
         *         description: Erro de validação
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/list`, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.findAll(req, res, next);
        })

        /**
         * @swagger
         * /grants/:id:
         *   get:
         *     summary: Retorna um grant específico pelo ID
         *     tags:
         *       - [Grants]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do grant
         *     responses:
         *       200:
         *         description: Retorna a lista de grants do sistema
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
         *       400:
         *         description: Erro de validação
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Grant não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/:id`, authorize, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.findById(req, res, next);
        })

        /**
         * @swagger
         * /grants/:id/profiles:
         *   get:
         *     summary: Retorna os perfis associados a um grant
         *     tags:
         *       - [Grants]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do grant
         *     responses:
         *       200:
         *         description: Retorna os perfis associados ao grant
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
         *         description: Erro de validação
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Grant não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.get(`${basePath}/:id/profiles`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.getProfilesByGrantsId(req, res, next);
        })
    }

    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /grants/create:
         *   post:
         *     summary: Cria um novo grant
         *     tags:
         *       - [Grants]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Admin"
         *               description:
         *                 type: string
         *                 example: "Administrador do sistema"
         *     responses:
         *       201:
         *         description: Grant criado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   method:
         *                     type: string
         *                     example: "GET || POST || PUT || DELETE"
         *                   path:
         *                     type: string
         *                     example: "/v1/auth/register"
         *                   description:
         *                     type: string
         *                     example: "Rota de registro de grant"
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
        app.post(`${basePath}/create`, validateBodyGrants, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.createGrants(req, res, next);
        })
    }

    private registerRoutesPut(basePath: string, app: IAppRouter): void {
                /**
         * @swagger
         * /grants/:id:
         *   put:
         *     summary: Atualiza um grant existente
         *     tags:
         *       - [Grants]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do grant
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               method:
         *                 type: string
         *     responses:
         *       200:
         *         description: Grant atualizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   method:
         *                     type: string
         *                     example: "GET || POST || PUT || DELETE"
         *                   path:
         *                     type: string
         *                     example: "/v1/auth/..."
         *                   description:
         *                     type: string
         *                     example: "Rota de ..."
         *       400:
         *         description: Requisição inválida
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Grant não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.put(`${basePath}/:id`, validateParamId, validateBodyUpdateGrants,(req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.updateGrants(req, res, next);
        })
    }

    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        /**
         * @swagger
         * /grants/:id:
         *   delete:
         *     summary: Exclui um grant existente
         *     tags:
         *       - [Grants]
         *     security:
         *       - BearerAuth: [] # Requer um token JWT
         *       - sessionAuth: [] # Requer um token de sessão
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do grant
         *     responses:
         *       204:
         *         description: Grant excluído com sucesso
         *       401:
         *         description: Erro de autenticação
         *       403:
         *         description: Permissão negada
         *       404:
         *         description: Grant não encontrado
         *       500:
         *         description: Erro interno do servidor
         */
        app.delete(`${basePath}/:id`, validateParamId, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.deleteGrants(req, res, next);
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

export default GrantsRouter.getInstance()