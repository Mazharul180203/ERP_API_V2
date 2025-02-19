import {pool} from "../db.js";
import {CustomerValidation, customertypeValidation, CustomerledgerinvoiceValidation} from "../validation/CustomerValidation.js";

const CustomertypeService = async (req) => {
    const { typeName} = req.body;
    const { error }  = customertypeValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM customertype WHERE typeName = $1;',
            [typeName]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Customer Type is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO customertype (typeName) VALUES ($1) RETURNING *;',
            [typeName]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}
const CustomerService = async (req) => {
    const { name,customertypeid, mobileno, address, description} = req.body;
    const { error }  = CustomerValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM customer WHERE name = $1;',
            [name]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail",  message: "Customer is already exists." };
        }
        const result = await pool.query(
                'INSERT INTO customer (name,customertypeid, mobileno, address, description) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
            [name, customertypeid, mobileno, address, description]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}

const CustomerledgerinvoiceService = async (req) => {
    const { customerid, fromdate, todate } = req.query;

    const { error } = CustomerledgerinvoiceValidation.validate(req.query);
    if (error) {
        return { code: 400, status: "fail", message: "Validation Error", data: error.details[0].message };
    }

    const CustomerID = parseInt(customerid);
    let query = `
        SELECT c.name, c.address, cl.debit, cl.credit, cl.balance
        FROM customerledger cl
                 INNER JOIN customer c ON c.id = cl.customerid
        WHERE cl.customerid = $1
    `;
    const queryParams = [CustomerID];

    if (fromdate) {
        query += ` AND DATE(cl.createdat) >= $${queryParams.length + 1}`;
        queryParams.push(fromdate);
    }
    if (todate) {
        query += ` AND DATE(cl.createdat) <= $${queryParams.length + 1}`;
        queryParams.push(todate);
    }

    try {
        const result = await pool.query(query, queryParams);
        return { code: 201, status: "success", message: "Executed Successfully", data: result.rows };
    } catch (e) {
        console.error(e);
        return { code: 500, status: "fail", message: "Server Error" };
    }
};




export { CustomerService,CustomertypeService,CustomerledgerinvoiceService};