import {userinfoValidation} from "../validation/userValidation.js";
import path from "path";
import {pool} from "../db.js";


const userdetailsinfoService = async (req) => {
    const { userid, name, mobileno } = req.body;
    const { error } = userinfoValidation.validate(req.body);

    if (error) {
        return { code: 400, status: "fail", message: "Validation Error", data: error.details[0].message };
    }

    if (!req.files) {
        return { code: 400, status: "fail", message: "No files found" };
    }

    try {
        const uploadFiles = req.files['files'];
        const __dirname = path.resolve();
        const filesArray = Array.isArray(uploadFiles) ? uploadFiles : [uploadFiles];
        let uploadsData = [];

        for (const file of filesArray) {
            const currentTimestamp = Date.now();
            const fileName = `${currentTimestamp}_${file.name}`;
            const uploadPath = path.join(__dirname, '/uploadFile/', fileName);

            await file.mv(uploadPath);
            const relativeFilePath = `/uploadFile/${fileName}`;

            await pool.query(
                'INSERT INTO userdetails (userid, name, mobileno, image) VALUES ($1, $2, $3, $4) RETURNING *;',
                [userid, name, mobileno, relativeFilePath]
            );

            uploadsData.push(relativeFilePath);
        }

        return { code: 200, status: "success", message: "Profile Updated Successfully", data: uploadsData };
    } catch (e) {
        console.error("Error details:", e);
        return { code: 500, status: "fail", message: "Server Error" };
    }
};


export { userdetailsinfoService };