import {pool} from "../db.js";
import {registrationUserValidation, verifyLoginUserValidation} from "../validation/AuthValidation.js";
import {EncodeToken} from "../utility/TokenHelper.js";

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

        return {code: 200, status: "success", token: token, message: "Successfully logged in.",};
    } catch (error) {
        return {code: 500, status: "fail", message: "An error occurred during login.",};
    }
};


export { RegistrationService ,VerifyLoginService};