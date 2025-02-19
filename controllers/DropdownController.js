import {DropdownService} from "../services/DropdownService.js";

export const  dropdown =  async (req,res) =>{
    let response = await DropdownService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
