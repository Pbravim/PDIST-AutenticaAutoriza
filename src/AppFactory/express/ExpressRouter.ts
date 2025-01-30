import { Router } from 'express';
import { IApp, IAppRouter } from '../../interfaces/appInterface';

class ExpressRouter implements IAppRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }
    
    public post(path: string, ...args:  any[]): void {
        this.router.post(path, args);
    }
    
    public get(path: string, ...args:  any[]): void {
        this.router.get(path, args);
    }
    
    public put(path: string, ...args:  any[]): void {
        this.router.put(path, args);
    }
    
    public delete(path: string, ...args:  any[]): void {
        this.router.delete(path, args);
    }

    public patch(path: string, ...args:  any[]): void {
        this.router.patch(path, args);
    }
    
    public options(path: string, ...args:  any[]): void {
        this.router.options(path, args);
    }
    
    public head(path: string, ...args:  any[]): void {
        this.router.head(path, args);
    }
    
    public all(path: string, ...args:  any[]): void {
        this.router.all(path, args);
    }
    
    public use(...args: any[]): void {
        this.router.use(...args);
    }

    public getRouter(): IAppRouter {
        return this.router as unknown as IAppRouter;
    }

}

export default ExpressRouter;
