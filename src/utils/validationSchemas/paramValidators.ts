import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../customErrors/httpError";
import { idSchema } from "./schemas/autenticacaoSchema";

function validateParamId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): void {
    const { error } = idSchema.validate(req.params.id);
    if (error) {
        return next(new HttpError(400, error.details[0].message));
    }
    next();
}

export {
    validateParamId
}