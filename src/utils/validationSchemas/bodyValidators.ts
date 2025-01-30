import { func } from "joi";
import {
  IHttpNext,
  IHttpRequest,
  IHttpResponse,
} from "../../interfaces/httpInterface";
import HttpError from "../customErrors/httpError";
import {
  changePasswordSchema,
  emailSchema,
  externalRegisterLoginSchema,
  passwordSchema,
  standardRegisterLoginSchema,
  updateAuthSchema,
} from "./schemas/autenticacaoSchema";
import {
  grantsSchema,
  listIdsSchema,
  profileSchema,
  updateGrantsSchema,
} from "./schemas/autorizacaoSchema";

function validateBodyEmail(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = emailSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyPassword(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = passwordSchema.validate(req.body.password);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyStandardRegisterLogin(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = standardRegisterLoginSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyExternalRegisterLogin(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = externalRegisterLoginSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyChangePassword(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = changePasswordSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyUpdateAuth(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = updateAuthSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}
function validateBodyGrants(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = grantsSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyUpdateGrants(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = updateGrantsSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyProfile(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = profileSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyUpdateProfile(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = profileSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

function validateBodyListIds(
  req: IHttpRequest,
  res: IHttpResponse,
  next: IHttpNext
): void {
  const { error } = listIdsSchema.validate(req.body);

  if (error) {
    return next(new HttpError(400, error.details[0].message));
  }
  next();
}

export {
  validateBodyEmail,
  validateBodyPassword,
  validateBodyStandardRegisterLogin,
  validateBodyExternalRegisterLogin,
  validateBodyChangePassword,
  validateBodyUpdateAuth,
  validateBodyGrants,
  validateBodyUpdateGrants,
  validateBodyProfile,
  validateBodyUpdateProfile,
  validateBodyListIds,
};
