import Joi from "joi";

export const SaleProductValidation = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productid: Joi.number().integer().required(),
                customerid: Joi.number().integer().required(),
                salesqty: Joi.number().min(0).required(),
                priceperunit: Joi.number().min(0).required(),
                discount: Joi.number().min(0).required(),
                transportcost: Joi.number().min(0).required(),
            })
        )
        .min(1)
        .required(),
});

export const SalesCustomerTrackerValidation = Joi.object({
    customerid: Joi.number().integer().required(),
    totalcost: Joi.number().required(),
    paid: Joi.number().required(),
    balance: Joi.number().required(),
    paymenttype: Joi.string().required(),
    voucherno: Joi.string().required()

});

export const GetSalesCustomerTrackerValidation = Joi.object({
    customerid: Joi.number().integer().required()
});

export const SalesInvoiceValidation = Joi.object({
    customerid: Joi.number().integer().required(),
    fromdate: Joi.string().allow('').optional(),
    todate: Joi.string().allow('').optional(),
});