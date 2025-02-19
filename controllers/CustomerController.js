import {CustomerledgerinvoiceService, CustomerService, CustomertypeService} from "../services/CustomerService.js";

export const  customertype =  async (req,res) =>{
    let response = await CustomertypeService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const customer =  async (req,res) =>{
    let response = await CustomerService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const customerledgerinvoice =  async (req,res) =>{
    let response = await CustomerledgerinvoiceService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}