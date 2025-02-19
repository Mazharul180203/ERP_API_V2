import Joi from "joi";

export const registrationUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const verifyLoginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
