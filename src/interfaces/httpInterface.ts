import { IAuthentication } from "../_Autenticacao/Interfaces/authInterfaces";

export interface IHttpRequest {
    body: any;
    query: any;
    params: any;
    headers: any;
    session?: any;
}

export interface IHttpAuthenticatedRequest extends IHttpRequest {
    method: string;
    path: any;
    session: {
        auth?: Partial<IAuthentication>
        destroy?(arg0: (error: any) => void): unknown;
    }
}

export interface IHttpResponse {
    status(code: number): this;
    json(data: any): this;
    send(data: any): this;
    headersSent?: boolean;
}

export interface IHttpNext {
    (error?: any): void
}

