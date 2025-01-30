import Joi from "joi";

const idSchema = Joi.string().uuid().required().messages({
        "any.required": "Id is required",
        "string.uuid": "Id must be a valid uuid"
})

const emailSchema = Joi.object({
    login: Joi.string().email().required().messages({
        "any.required": "email is required",
        "string.email": "email must be a valid email"
    })
})

const passwordSchema = Joi.string()
    .min(6)
    .max(12)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,12}$'))    .messages({
        'any.required': 'A senha é obrigatória.',
        'string.min': 'A senha deve ter no mínimo 6 caracteres.',
        'string.max': 'A senha deve ter no máximo 12 caracteres.',
        'string.pattern.base': 'A senha deve ter entre 6 e 12 caracteres e incluir pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
    });

const changePasswordSchema = Joi.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema
});

const standardRegisterLoginSchema = Joi.object({
    login: Joi.string().required().messages({
        "any.required": "login is required",
        "string": "login must be a string"
    }),
    password: passwordSchema
})

const externalRegisterLoginSchema = Joi.object({
    code: Joi.string().required().messages({
        "any.required": "code is required",
        "string": "code must be a string"
    }),
    provider: Joi.string().required().messages({
        "any.required": "provider is required",
        "string": "provider must be a string"
    })
})

const updateAuthSchema = Joi.object({
    login: emailSchema.extract('login').optional(),
    password: passwordSchema.optional(),
}).or('login', 'password')

export {
    idSchema,
    standardRegisterLoginSchema,
    externalRegisterLoginSchema,
    emailSchema,
    passwordSchema,
    changePasswordSchema,
    updateAuthSchema,
}