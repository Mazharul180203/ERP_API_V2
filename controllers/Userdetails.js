import {sendmailService, userdetailsinfoService} from "../services/userdetailsService.js";

export const  userdetails =  async (req,res) =>{
    let response = await userdetailsinfoService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const  sendmail =  async (req,res) =>{
    let response = await sendmailService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
