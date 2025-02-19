import {pool} from "../db.js";
import {DropdownValidation} from "../validation/DropdownValidation.js";

const DropdownService = async (req) => {
    const {type} = req.params;
    const { error } = DropdownValidation.validate(req.params);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try{
        let result, typeName;
        if(type === "category"){
             result = await pool.query(`SELECT id, categoryname FROM category`,);
             typeName = 'category'
        }else if(type === "brands"){
             result = await pool.query(`SELECT id, brandname FROM brands`,);
             typeName = 'brands'
        }else if(type === "unit"){
             result = await pool.query(`SELECT id, unitname,unitslabel,relation FROM units`,);
            typeName = 'unit'
        }else if(type === "supplier"){
             result = await pool.query(`SELECT id, suppliername,contactperson,mobilenumber,address FROM supplier`,);
            typeName = 'supplier'
        }else if(type === "customertype"){
             result = await pool.query(`SELECT id, typename FROM customertype`,);
            typeName = 'customertype'
        }else if(type === "items"){
             result = await pool.query(`SELECT id, name FROM customer`,);
            typeName = 'items'
        }else if(type === "products"){
             result = await pool.query(`SELECT id, name,description FROM products`,);
            typeName = 'products'
        }else{
            return {code: 400,status:"fail", message: "Invalid Request" };
        }
        return { code: 200, status: "success", message:`${typeName} is successfully fetched`, data: result.rows, typeName};

    }catch (e) {
        console.error(e);
        return { code: 500, status: "fail", message: e.message  };
    }
}

export {DropdownService};