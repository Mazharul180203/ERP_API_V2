import {RefreshtokenService, RegistrationService, VerifyLoginService} from '../services/AuthService.js'


export const Registration = async (req,res) =>{
    let response = await RegistrationService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const VerifyLogin = async (req,res) =>{
    let response = await VerifyLoginService(req);
    console.log("verifylogin :",response);
    if (response['code'] === 200) {
        let cookieOption={expires:new Date(Date.now() + 15 * 60 * 1000), httpOnly:false, sameSite: 'strict'}
        let refreshOption={expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly:false, sameSite: 'strict'};
        res.cookie('token',response['token'],cookieOption);
        res.cookie('refreshToken',refreshOption['refreshToken'],refreshOption)
        return res.status(response.code).json({status: response.status, message: response.message, token: response.token || null, refreshToken: response.refreshToken || null});
    } else {
        res.status(response.code).json({status: response.status, message: response.message, token: response.token || null});
    }

}
export const refreshtoken = async (req,res) =>{
    let response = await RefreshtokenService(req);
    if (response['code'] === 200) {
        let cookieOption={expires:new Date(Date.now()+2*24*60*60*1000), httpOnly:false}
        res.cookie('token',response['token'],cookieOption, { httpOnly: true, sameSite: 'strict'});
        return res.status(response.code).json({status: response.status, message: response.message, token: response.token || null, refreshToken: response.refreshToken || null});
    } else {
        res.status(response.code).json({status: response.status, message: response.message, token: response.token || null});
    }

}
export const AuthDestroy=async(req,res)=>{
    try {
        let cookieOptions = {
            expires: new Date(Date.now()-2*24*60*60*1000),
            httpOnly: false
        };
        res.cookie('token', '', cookieOptions,{ httpOnly: true, sameSite: 'strict'});
        return res.status(200).json({ status: "success", message:"Successfully LogOut.."});
    } catch (error) {
        return res.status(500).json({ status: "fail", error: error.message || 'Internal Server Error' });
    }
}