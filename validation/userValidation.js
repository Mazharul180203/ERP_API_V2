import Joi from "joi";

export const userinfoValidation = Joi.object({
    userid: Joi.number().integer().required(),
    name: Joi.string().required(),
    mobileno: Joi.string().required(),
});