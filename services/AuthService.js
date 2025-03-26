import {pool} from "../db.js";
import {registrationUserValidation, verifyLoginUserValidation} from "../validation/AuthValidation.js";
import {DecodeToken, EncodeToken, GenerateRefreshToken} from "../utility/TokenHelper.js";
import res from "express/lib/response.js";

const RegistrationService = async (req) => {
    const { email, password } = req.body;
    const { error }  = registrationUserValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1;',
            [email]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Email already exists." };
        }

        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;',
            [email, password]
        );
        return { code: 201, status:"success", message: "Successfully Registered", data: result.rows };
    } catch (e) {
        return { code: 500, message: "An error occurred while registering the user." };
    }
};


const VerifyLoginService = async (req) => {
    const { email, password } = req.body;
    const { error } = verifyLoginUserValidation.validate(req.body);
    if (error) {
        return {code: 400, status: "fail", message: "Validation Error", data: error.details[0].message,};
    }

    try {
        const userQuery = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND password = $2;',
            [email, password]
        );

        if (userQuery.rows.length === 0) {
            return {code: 403, status: "fail", message: "Invalid email or password.",};
        }

        const userId = userQuery.rows[0].id;
        const token = await EncodeToken(email, userId);
        const refreshToken = GenerateRefreshToken(email, userId);
        console.log("dfdf : ",token, refreshToken,userId)

        await pool.query(
            'INSERT INTO user_tokens (userid, refreshtoken,expires_at) VALUES ($1, $2, $3)',
            [userId, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
        )

        return {code: 200, status: "success", token: token, refreshToken:refreshToken, message: "Successfully logged in.",};
    } catch (error) {
        return {code: 500, status: "fail", message: "An error occurred during login.",};
    }
};
const RefreshtokenService = async (req) => {
    const { refreshToken } = req.body;
    if(!refreshToken){
        return {code:400,  status:"fail", message: "Refresh token is required",};
    }

    try {
        const decoded = DecodeToken(refreshToken);
        if(decoded === null){
            return {code:401,  status:"fail", message: "Refresh token is Invalid",};
        }
        const existtonken = await pool.query(
            'SELECT * FROM user_tokens WHERE refreshtoken = $1 AND userid = $2 AND expires_at > now()',
            [refreshToken, decoded.user_id]
        );

        if (existtonken.rows.length === 0) {
            return {code: 403, status: "fail", message: "Refresh token not found or expired.",};
        }

        const newAccessToken = EncodeToken({
            email: decoded.email,
            user_id: decoded.user_id
        });

        return {code: 200, status: "success", token: newAccessToken, message: "Successfully Entered System.",};
    } catch (error) {
        return {code: 500, status: "fail", message: "Failed to refresh token.",};
    }
};


export { RegistrationService ,VerifyLoginService,RefreshtokenService};