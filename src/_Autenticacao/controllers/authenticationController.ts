import createAuthStrategy from "../auth/authFactory";
import { IAuthenticationController, IAuthenticationService, IAuthStrategy, IAuthentication, IExternalAuthenticationService, IExternalAuthentication, IOAuthUserInfo} from "../Interfaces/authInterfaces";
import { IHttpAuthenticatedRequest, IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface";
import AuthenticationService from "../services/authenticationService";
import HttpError from "../../utils/customErrors/httpError";
import {sendPasswordResetEmail} from "../../utils/mail/Email"
import { IProfileService } from "../../_Autorização/Interfaces/profileInterfaces";
import profileService from "../../_Autorização/services/profileService";
import ExternalAuthenticationService from "../services/externalAuthenticationService";

import dotenv from 'dotenv'
import { createOAuth2Strategy } from "../auth/oAuthFactoty";
import { randomBytes } from "crypto";
dotenv.config()

function generatePassword(length: number): string{
    return randomBytes(length).toString('base64').slice(0, length)
}

async function getUserInfoByCodeAndProvider(code: string, provider: string): Promise<IOAuthUserInfo>{
    const OAuth2Strategy = createOAuth2Strategy(provider)

    const accessToken = await OAuth2Strategy.getToken(code)

    if(!accessToken){
        throw new HttpError(404, "Token de acesso não encontrado")
    }

    return await OAuth2Strategy.getUserInfo(accessToken)
}

class AuthenticationController implements IAuthenticationController{
    private static instance: AuthenticationController;
    private authService: IAuthenticationService;
    private externalAuthService: IExternalAuthenticationService
    private authStrategy: IAuthStrategy;
    private profileService: IProfileService;
 
    /**
     * The private constructor for the AuthenticationController.
     * It is private because only the getInstance method should be able to create an instance of this class.
     * @param authService The authentication service to use.
     */
    private constructor(authService: IAuthenticationService, externalAuthService: IExternalAuthenticationService) {
        this.authService = authService;
        this.externalAuthService = externalAuthService
        this.authStrategy = createAuthStrategy();
        this.profileService = profileService;
    }


    /**
     * Gets an instance of the AuthenticationController.
     * If the instance doesn't exist, it creates one with the given authService.
     * @param authService The authentication service to use.
     * @returns The instance of the AuthenticationController.
     */
    static getInstance(authService: IAuthenticationService, externalAuthService: IExternalAuthenticationService): AuthenticationController {
        if (!AuthenticationController.instance) {
            AuthenticationController.instance = new AuthenticationController(authService, externalAuthService);
        }               

        return AuthenticationController.instance; 
    }

    /**
     * @inheritdoc
     */
    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const authentications = await this.authService.findAll();
    
            if (authentications.length < 1) {
                throw new HttpError(404, 'Authentications not found');
            }
                        
            res.status(200).json(authentications);
        } catch (error: any) {
            next(error)
        }
    }
    
    async findAllByAuthenticationId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;

            const authentications = await this.externalAuthService.findAllByAuthenticationId(id);
    
            if (authentications.length < 1) {
                throw new HttpError(404, 'Authentications not found');
            }
                        
            res.status(200).json(authentications);
        } catch (error: any) {
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async findMe(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const id = req.session.auth!.id;

            const user = await this.authService.findById(id!);

            if(!user) {
                throw new HttpError(404, 'User not found');
            }

            res.status(200).json(user);
        } catch (error: any) {
            next(error)
        }
    }


    /**
     * @inheritdoc
     */
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;

            const auth = await this.authService.findById(id);
            
            if (!auth) {
                throw new HttpError(404, 'Authentication not found');
            }

            res.status(200).json(auth);
        } catch (error: any) {
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async createAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        let auth: IAuthentication | undefined
        try {
            const { login, password }  = req.body;

            const authData: Partial<IAuthentication> = {
                login,
                passwordHash: password,
            }

            auth = await this.authService.createStandartAuthentication(authData);
        
            if (!auth) {
                throw new HttpError(400, 'Authentication not created');
            }

            const profile_id = process.env.USER_COMUM_PROFILE!

            await this.profileService.addProfilesToAuthentication([profile_id], auth.id);

            const { passwordHash, password_token_expiry_date, password_token_reset, ...authSemSenha } = auth;

            res.status(201).json({ auth: authSemSenha });
        } catch (error: any) {
            console.log(error)
            if (auth && auth.id) {
                await this.authService.deleteAuthentication(auth.id)
            }

            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updateMyAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const id = req.session?.auth?.id;
            const {login} = req.body;
            
            const authData: Partial<IAuthentication> = {
                login,
            }
            
            const updatedAuth = await this.authService.updateAuthentication(id!, authData);

            const { passwordHash, password_token_expiry_date, password_token_reset, ...authSemSenha } = updatedAuth;
            res.status(200).json(authSemSenha);
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updateAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const {id} = req.params;
            const {login} = req.body;

            if(!id){
                throw new HttpError(400, 'Id is required');
            }

            if(!login ){
                throw new HttpError(400, 'Login is required');
            }

            const authData: Partial<IAuthentication> = {
                login
            }

            const updatedAuth = await this.authService.updateAuthentication(id, authData);
            res.status(200).json(updatedAuth);
        }catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async requestPasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { login } = req.body;

            const auth = await this.authService.findByLogin(login);
            
            if (!auth) {
               throw new HttpError(404, 'Authentication not found');
            }

            const token = await this.authService.setPasswordTokenAndExpiryDate(auth!.id);
            
            const sent = await sendPasswordResetEmail(login, token)

            if (!sent) {
                throw new HttpError(500, 'Error sending email');
            }

            res.status(204).send({})
        }catch(error: any){
            next(error)
        }
    }

    /**
     * Fase de testes
     */
    async updatePasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { token } = req.query;
            const { password } = req.body;

            const user = await this.authService.findByToken(token);
            
            if(!user){
                throw new HttpError(404, 'Authentication not found');
            }
            
            if (!await this.authService.isPasswordTokenValid(user.id, token)){;
                throw new HttpError(403, 'Token is not valid');
            }   

            await this.authService.updatePassword(user.id, password);
            res.status(204).json({})
        } catch(error: any){
            next(error)
        }
    }
    
    /**
     * @inheritdoc
     */
    async deleteAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;

            await this.authService.deleteAuthentication(id);

            res.status(204).json({});
        }catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async standartAuthenticate(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { login, password } = req.body;
            
            const auth = await this.authService.authenticate(login, password);

            if (!auth) {
                throw new HttpError(404, 'Authentication not found');
            }
            if (!auth.active) {
                throw new HttpError(401, 'Authentication is not active');
            }

            const tokenOrSessionId = await this.authStrategy.authenticate(req, {id: auth!.id}); 
            if (!tokenOrSessionId) {
                throw new HttpError(400, 'AuthStrategy Failed');
            }

            res.status(200).json({tokenOrSessionId: tokenOrSessionId});
        }catch(error: any){
            console.log(error)
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { oldPassword, newPassword} = req.body;
            const id = req.session?.auth?.id;

            if (!await this.authService.validatePassword(id!, oldPassword)) {
                throw new HttpError(400, 'Invalid password');
            }

            await this.authService.updatePassword(id!, newPassword);
            res.status(204).json({});
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async toggleAuthenticationStatus(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            
            const { id } = req.params;
            const { toggle } = req.query;

            if (!id) {
                throw new HttpError(400, 'Invalid credentials');
            }

            if (toggle === 'true') {
                await this.authService.activateAccountAuthentication(id!);
            } else {
                await this.authService.deactivateAccountAuthentication(id!);
            }

            res.status(204).json({});
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async validatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const {password} = req.body;
            const id = req.session?.auth?.id;

            const valid = await this.authService.validatePassword(id!, password);
            
            if (!valid) {
                res.status(400).json({ message: 'Password invalid' });
                return
            } 

            res.status(200).json({ message: 'Password valid' });
        } catch (error: any) {
            next(error)
        }       
    }

    /**
     * @inheritdoc
     */
    async logout(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            if (!req.session) {
                throw new HttpError(400, 'Invalid credentials');
            }

            req.session.destroy!((error: any) => {
                if (error) {
                    next(error);
                    return;
                }
                res.status(204).json({});
            });
        }catch (error: any) {
            next(error)
        }
    }

    
    async getProfilesByAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;

            const profiles = await this.authService.getProfilesByAuthenticationId(id);

            if (!profiles || profiles.length === 0) {
                throw new HttpError(404, 'Profiles not found');
            }

            res.status(200).json(profiles);
        } catch(error: any){
            next(error)
        }
    }

    // async createExternalAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
    //     try {
    //         const {provider, code} = req.body;
        
    //         const cleanProvider = provider.toLowerCase().trim()

    //         let externalAuthentication: IExternalAuthentication
            
    //         const userInfo = await getUserInfoByCodeAndProvider(code, cleanProvider)
            
    //         let newAuth: Partial<IExternalAuthentication> = {
    //             external_id: userInfo.data!.id,
    //             email: userInfo.data!.email,
    //             provider: cleanProvider
    //         }

    //         const authExist = await this.authService.findByLogin(userInfo.data!.email)
            
    //         if(!authExist){
    //             const standartAuthentication = await this.authService.createStandartAuthentication({login: userInfo.data.email, passwordHash: generatePassword(10)})
    //             if (!standartAuthentication){
    //                 throw new HttpError(400, "Erro ao criar autenticação tradicional")
    //             }
                
    //             newAuth.authentication_id = standartAuthentication.id
    //         }else {
    //             newAuth.authentication_id = authExist.id
    //         }
    //         externalAuthentication = await this.externalAuthService.createExternalAuthentication(newAuth)
            
    //         if(!externalAuthentication){
    //             throw new HttpError(400, "Erro ao criar autenticação")
    //         }
                  
    //         res.status(201).json(externalAuthentication)
    //     } catch(error: any){
    //         next(error)
    //     }
    // }

    async addExternalAuthToAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const id = req.session.auth!.id
            const {provider, code} = req.body;

            const userInfo = await getUserInfoByCodeAndProvider(code, provider)

            let newAuth: Partial<IExternalAuthentication> = {
                external_id: userInfo.data.id,
                email: userInfo.data.email,
                authentication_id: id,
                provider
            }

            const externalAuthentication = await this.externalAuthService.addExternalToAuthentication(newAuth)

            if(!externalAuthentication){
                throw new HttpError(400, "Erro ao criar autenticação")
            }

            res.status(201).json(externalAuthentication)
        } catch(error: any){
            next(error)
        }
    }


    //PRECISO REFAZER ESSE METODO -- SO FUNCIONA SE AS AUTENTICACOES FOREM IGUAIS EXEMPLO 
    //INOVATECJPDEV@GMAIL.COM -> Autenticação Interna
    //INOVATECJPDEV@GMAIL.COM -> Autenticação Externa
    //CASO SEJA DIFERENTE NAO FUNCIONA
    async authenticateExternal(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const {provider, code} = req.body;
        
            const cleanProvider = provider.toLowerCase().trim()

            const userInfo = await getUserInfoByCodeAndProvider(code, cleanProvider)

            const externalAuth = await this.externalAuthService.findByExternalIdAndProvider(userInfo.data.id, cleanProvider)
            
            if(!externalAuth){
                const standartAuthentication = await this.authService.createStandartAuthentication({login: userInfo.data.email, passwordHash: generatePassword(10)})
                
                let newAuth: Partial<IExternalAuthentication> = {
                    authentication_id: standartAuthentication.id,
                    external_id: userInfo.data!.id,
                    email: userInfo.data!.email,
                    provider: cleanProvider
                }

                await this.externalAuthService.createExternalAuthentication(newAuth)
            }

            const auth = await this.authService.findById(externalAuth!.authentication_id)

            if(!auth){
                throw new HttpError(404, "Autenticação nao encontrada")
            }

            const tokenOrSessionId = await this.authStrategy.authenticate(req, {id: auth!.id}); 
            
            if (!tokenOrSessionId) {
                throw new HttpError(400, 'AuthStrategy Failed');
            }

            res.status(200).json({tokenOrSessionId: tokenOrSessionId});
        } catch(error: any){
            next(error)
        }
    }
}
    
export default AuthenticationController.getInstance(AuthenticationService, ExternalAuthenticationService);