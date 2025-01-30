import Joi from "joi";
import { idSchema } from "./autenticacaoSchema";

const methodSchema = Joi.string().valid(
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 
    'HEAD', 'OPTIONS', 'CONNECT', 'TRACE'
).required().messages({
    "any.required": "Method is required",
    "string.base": "Method must be a string",
    "any.only": "Method must be one of GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, TRACE"
})

const pathSchema = Joi.string().required().messages({
    "any.required": "Path is required",
    "string.base": "Path must be a string",
    "string.pattern.base": "Path must be a valid path"
})

const descriptionSchema = Joi.string().optional().messages({
    "string.base": "Description must be a string"
})

const grantsSchema = Joi.object({
    method: methodSchema,
    path: pathSchema,
    description: descriptionSchema
});

const updateGrantsSchema = Joi.object({
    method: methodSchema.optional(),
    path: pathSchema.optional(),
    description: descriptionSchema.optional()
}).or('method', 'path', 'description')

const nameSchema = Joi.string().required().messages({
    "any.required": "Name is required",
    "string.base": "Name must be a string"
})

const profileSchema = Joi.object({
    name: nameSchema,
    description: descriptionSchema
})

const updateProfileSchema = Joi.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional()
}).or('name', 'description')

    
const listIdsSchema = Joi.array().items(Joi.string().required().uuid()).min(1).messages({
    "array.base": "Profiles should be an array",
    "array.min": "Profiles are required and cannot be empty",
    "string.base": "Each profile ID must be a string",
    "string.uuid": "Each profile ID must be a valid uuid",
    "any.required": "Each profile ID is required"
})

export {
    grantsSchema,
    updateGrantsSchema,
    profileSchema,
    updateProfileSchema,
    listIdsSchema,
    
}