import HttpError from './utils/customErrors/httpError';
import { IApp } from './interfaces/appInterface';
import createAppFactory from './AppFactory/appFactory';
import { IHttpNext, IHttpRequest, IHttpResponse } from './interfaces/httpInterface';
import AuthenticationRouter from './_Autenticacao/routes/AuthenticationRouter';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import ProfileRouter from './_Autorização/routes/profileRouter';
import GrantsRouter from './_Autorização/routes/grantsRouter';
import swaggerRouter from './utils/swagger/swaggerConfig';
import cors, { CorsOptions } from 'cors'
import jsonwebtoken from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
  

function useSession(app: IApp) {
    if (process.env.AUTH_STRATEGY !== 'session') {
        return
    }
    if (process.env.PROJETO_FASE === 'development') {
        app.use(cookieSession({
            secret: process.env.SESSION_SECRET || 'HESTIA',
            name: 'authSession',
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }))
    }
    if (process.env.PROJETO_FASE === 'production') {
        app.use(cookieSession({
            secret: process.env.SESSION_SECRET || 'HESTIA',
            name: 'authSession',
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        }))
    }
}

class App {
    public app: IApp;
    private static instance: App;
    
    /**
     * Creates a new instance of the App class.
     * It initializes the application by registering all the middlewares, routes and error handlers.
     */
    constructor(){
        this.app = createAppFactory();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }
    
    /**
     * Returns a singleton instance of the App class.
     * If the instance does not exist, it creates a new one.
     * Ensures that only one instance of the App class is created.
     *
     * @returns {App} The single instance of the App class.
     */
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

/**
 * Configures and applies middleware to the application.
 * 
 * - Uses body-parser to parse incoming request bodies in JSON format.
 * - If the environment variable AUTH_STRATEGY is set to 'session', applies
 *   cookie-session middleware for session management with specified options.
 */
    private middlewares() {
        this.app.use(cors())

        this.app.use(bodyParser.json());
        useSession(this.app)
    }

    private routes() {
        swaggerRouter(this.app.router);
        
        AuthenticationRouter.registerRoutes("/auth", this.app.router);    
        ProfileRouter.registerRoutes("/profile", this.app.router);
        GrantsRouter.registerRoutes("/grants", this.app.router);
        
        this.app.use(this.app.router.getRouter())
    }

    /**
     * Registers a global error handler for the application.
     * 
     * If the error is an instance of HttpError, it is handled by returning a JSON response with the status and message of the error.
     * If the error is not an instance of HttpError, it is handled by returning a JSON response with a status of 500 and the error message.
     * 
     * This error handler is applied to the application after all routes have been registered.
     */
    private errorHandler() {
        this.app.use((err: any, req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            if (err instanceof HttpError) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }

        });
    }

    public start(port: number): void {
        this.app.start(port);
        console.log(`${process.env.BASE_URL}:${port}/api-docs`)
    }
}

export default App.getInstance();


