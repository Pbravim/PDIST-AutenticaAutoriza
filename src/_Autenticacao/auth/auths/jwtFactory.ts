import { IHttpAuthenticatedRequest, IHttpRequest } from "../../../interfaces/httpInterface";
import HttpError from "../../../utils/customErrors/httpError";
import { IAuthentication, IAuthStrategy } from "../../Interfaces/authInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';

class jwtFactory implements IAuthStrategy {    
    /**
     * Gera um token JWT para uma autenticao.
     * @param {Partial<IAuthentication>} auth - A autenticao.
     * @returns {Promise<string>} Retorna o token JWT.
     */
    async authenticate(req: IHttpRequest, auth: Partial<IAuthentication>): Promise<string> {
        const token = jwt.sign({ id: auth.id }, process.env.JWT_SECRET || '123', { expiresIn: '12h' });
        req.session = { auth: token };
        return token
    }

    async verify(token: string): Promise<JwtPayload> {
        try {
        /**
         * Verifica se o token JWT  vlido.
         * @param {string} token - O token JWT.
         * @returns {Promise<object>} Retorna o payload do token JWT, caso o token seja vlido.
         * @throws {Error} Caso o token seja inv lido.
         */
            const token_decoded: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET || "123");
            
            return (token_decoded as JwtPayload)
        } catch (err) {
            throw new Error('Invalid token');
        }
    }


    /**
     * Verifica se o token JWT  vlido, e retorna o id do usurio autenticado.
     * @param {IHttpAuthenticatedRequest} req - A requisi o.
     * @returns {Promise<{id: string}>} Retorna um objeto com o id do usurio autenticado.
     * @throws {HttpError} Caso o token seja inv lido.
     */
    async checkAuthentication(req: IHttpAuthenticatedRequest): Promise<{id: string}>{
        if(req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');

            if (!/^Bearer$/i.test(authHeader[0])) {
                throw new HttpError(401, 'Invalid token');
            }

            const token = authHeader[1];
            const token_decoded = jwt.verify(token, process.env.JWT_SECRET || "123");

            return token_decoded as {id: string };
        } else {
            throw new HttpError(401, 'Invalid token');
        }
    }
}

export default jwtFactory