import {pool} from "../db.js";
import {
    GetSalesCustomerTrackerValidation,
    SaleProductValidation,
    SalesCustomerTrackerValidation, SalesInvoiceValidation
} from "../validation/SaleValidation.js";

const SaleProductService = async (req) => {
    const { items } = req.body;
    console.log(items);
    const { error } = SaleProductValidation.validate(req.body, { abortEarly: false });
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        await pool.query("BEGIN");
        const responses = [];
        for (const item of items) {
            const {productid, customerid, salesqty, priceperunit, discount, transportcost} = item;

            const saleQuantity = parseFloat(salesqty);
            const pricePerUnit = parseFloat(priceperunit);
            const subtotalAmount = ((saleQuantity * pricePerUnit).toFixed(2)) - parseFloat(discount) + parseFloat(transportcost);

            let newSaleItem;
                newSaleItem = await pool.query('INSERT INTO sales (productid, customerid, salesqty, discount,transportcost, salesprice) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                    [productid, customerid, saleQuantity, discount, transportcost, subtotalAmount]);
            await pool.query(
                `UPDATE stock
                 SET updatetotalpurchaseqty = updatetotalpurchaseqty - $1 WHERE productid = $2`,
                [saleQuantity, productid]
            );

            responses.push(newSaleItem.rows[0]);
        }
        await pool.query("COMMIT");

        return { code: 200, status: "success", message: "Sale Completed Successfully", data: responses };
    } catch (e) {
        await pool.query("ROLLBACK");
        console.error(e);
        return { code: 500, status: "fail", message: e.message };
    }
};


const SalesCustomerTrackerService = async (req) => {
    const { customerid, totalcost, paid, balance, paymenttype, voucherno } = req.body;
    const { error } = SalesCustomerTrackerValidation.validate(req.body, { abortEarly: false });
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    await pool.query("BEGIN");
    try {
        const existingCustomer = await pool.query(
            `SELECT * FROM salescustomertracker WHERE customerid = $1`,
            [customerid]
        );

        await pool.query(
            `INSERT INTO customerledger  (customerid, paymenttype, credit, debit, balance, voucherno)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [customerid, paymenttype, totalcost, paid, balance, voucherno]
        );

        let customerTrackerResult;

        if (existingCustomer.rows.length === 0) {

            const insertResult = await pool.query(
                `INSERT INTO salescustomertracker (customerid, balance , paymenttype)
                 VALUES ($1, $2, $3) RETURNING *`,
                [customerid, balance, paymenttype]
            );
            customerTrackerResult = insertResult.rows[0];

        } else {
            await pool.query(
                `UPDATE salescustomertracker SET balance = $1, paymenttype = $2
                 WHERE customerid = $3`,
                [balance, paymenttype, customerid]
            );

            const updateResult = await pool.query(
                `SELECT * FROM salescustomertracker WHERE customerid = $1`,
                [customerid]
            );
            customerTrackerResult = updateResult.rows[0];
        }

        await pool.query("COMMIT");

        return { code: 200, status: "success", data: customerTrackerResult };
    } catch (e) {
        await pool.query("ROLLBACK");
        console.error(e);
        return { code: 500, status: "fail", message: e.message  };
    }
};

const GetSalesCustomerTrackerService = async (req) => {
    const customerid = parseInt(req.params.customerid);
    const { error } = GetSalesCustomerTrackerValidation.validate(req.params);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try{
        const existingCustomer = await pool.query(`SELECT balance, paymenttype FROM salescustomertracker WHERE customerid = $1`,
            [customerid]
        );
        return { code: 200, status: "success", data: existingCustomer.rows };

    }catch (e) {
        console.error(e);
        return { code: 500, status: "fail", message: e.message  };
    }
}

const SalesInvoiceService = async (req) => {
    const { customerid, fromdate, todate } = req.query;
    console.log("query : ", req.query);
    const { error } = SalesInvoiceValidation.validate(req.query);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    const CustomerID = parseInt(customerid);
    let query = `
        select c.name,cl.voucherno, cl.balance,cl.debit,cl.credit, TO_CHAR(cl.updatedat, 'YYYY-MM-DD') AS date
            from customerledger cl
        inner join customer c on c.id = cl.customerid
        `
    const queryParams = [];
    if(CustomerID){
        query += ` where customerid = $${queryParams.length + 1}`;
        queryParams.push(CustomerID);
    }
    if (fromdate) {
        query += ` AND DATE(cl.createdat) >= $${queryParams.length + 1}`;
        queryParams.push(fromdate);
    }
    if (todate) {
        query += ` AND DATE(cl.createdat) <= $${queryParams.length + 1}`;
        queryParams.push(todate);
    }
    try{
        const result = await pool.query(query, queryParams);
        return { code: 201, status: "success", message: "Executed Successfully", data: result.rows };

    }catch (e) {
        console.error(e);
        return { code: 500, status: "fail", message: e.message  };
    }
}
export {SaleProductService,SalesCustomerTrackerService,GetSalesCustomerTrackerService,SalesInvoiceService}

