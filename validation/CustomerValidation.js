import Joi from "joi";

export const CustomerValidation = Joi.object({
    name: Joi.string().required(),
    customertypeid: Joi.number().integer().required(),
    mobileno:Joi.string().required(),
    address:Joi.string().required(),
    description:Joi.string().required()
});
export const customertypeValidation = Joi.object({
    typeName: Joi.string().required(),

});
export const CustomerledgerinvoiceValidation = Joi.object({
    customerid: Joi.string().required(),
    fromdate: Joi.string().allow('').optional(),
    todate: Joi.string().allow('').optional(),
});