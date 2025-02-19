import Joi from "joi";

export const DropdownValidation = Joi.object({
    type: Joi.string().required(),

});