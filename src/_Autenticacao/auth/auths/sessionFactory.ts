import { IHttpAuthenticatedRequest, IHttpRequest } from "../../../interfaces/httpInterface";
import HttpError from "../../../utils/customErrors/httpError";
import { IAuthentication, IAuthStrategy } from "../../Interfaces/authInterfaces";

class SessionStrategy implements IAuthStrategy {

    async authenticate(req: IHttpRequest, auth: Partial<IAuthentication>): Promise<string> {
        req.session = { auth: auth };
        return `Session started for user ${auth.id}`;
    }


    async verify(sessionId: string): Promise<object | string> {
        if (!sessionId) {
            throw new Error('Invalid session');
        }
        return { id: sessionId }; 
    }

    async checkAuthentication(req: IHttpAuthenticatedRequest): Promise<object> {
        if (!req.session || !req.session.auth || !req.session.auth.id ) {
                throw new HttpError(401, 'Invalid session');
            }
        return { id: req.session.auth.id };
    }

}

export default SessionStrategy;