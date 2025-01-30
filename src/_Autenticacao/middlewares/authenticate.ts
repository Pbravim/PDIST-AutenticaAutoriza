import createAuthStrategy from "../auth/authFactory";
import {
  IHttpAuthenticatedRequest,
  IHttpNext,
  IHttpResponse,
} from "../../interfaces/httpInterface";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware de autentica o
 *
 * Verifica se o usuario esta autenticado e se a autentica o   valida
 *
 * @param {IHttpAuthenticatedRequest} req - Requisi o gen rica de um usu rio autenticado
 * @param {IHttpResponse} res - Resposta gen rica
 * @param {IHttpNext} next - Fun o que executa o pr ximo middleware
 */
async function authenticate(
  req: IHttpAuthenticatedRequest,
  res: IHttpResponse,
  next: IHttpNext
) {
  try {
    const authStrategy = createAuthStrategy();

    const authId = await authStrategy.checkAuthentication(req);

    if (!authId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!req.session) {
      req.session = {};
    }

    req.session.auth = authId;

    next();
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: "Authentication failed" });
  }
}

export { authenticate };
