import Joi from "joi";

export const categoryValidation = Joi.object({
    categoryName: Joi.string().required(),

});
export const brandValidation = Joi.object({
    brandName: Joi.string().required(),

});
export const unitValidation = Joi.object({
    unitName: Joi.string().required(),
    unitsLabel: Joi.string().required(),
    relation: Joi.string().required(),

});
export const supplierValidation = Joi.object({
    supplierName: Joi.string().required(),
    contactPerson: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    address: Joi.string().required(),

});

export const ProductValidation = Joi.object({
    name: Joi.string().required(),
    categoryid: Joi.number().integer().required(),
    description: Joi.string().required(),
    brandid: Joi.number().integer().required(),
    unitid: Joi.number().integer().required(),
});
export const StockValidation = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productid: Joi.number().required(),
                supplierid: Joi.number().required(),
                purchaseqty: Joi.number().min(0).required(),
                priceperunit: Joi.number().min(0).required(),
                discount: Joi.number().min(0).required(),
                transportcost: Joi.number().min(0).required(),
            })
        )
        .min(1) // Ensure at least one item in the array
        .required(),
});

export const PurchaseSupplierTrackerValidation = Joi.object({
    supplierid: Joi.number().integer().required(),
    totalCost: Joi.number().required(),
    paid: Joi.number().required(),
    currbalance: Joi.number().required(),
    paymenttype: Joi.string().required(),
    voucherno: Joi.string().required(),
});
export const GetPurchaseSupplierTrackerValidation = Joi.object({
    supplierid: Joi.string().required()
});
export const SupplierPurchaseinvoiceValidation = Joi.object({
    supplierid: Joi.string().required(),
    fromdate: Joi.string().allow('').optional(),
    todate: Joi.string().allow('').optional(),
});