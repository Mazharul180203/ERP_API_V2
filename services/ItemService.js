import {
    brandValidation,
    categoryValidation, GetPurchaseSupplierTrackerValidation,
    ProductValidation,
    PurchaseSupplierTrackerValidation,
    StockValidation, SupplierPurchaseinvoiceValidation,
    supplierValidation,
    unitValidation
} from "../validation/ItemValidation.js";
import {pool} from "../db.js";

const CategoryService = async (req) => {
    const { categoryName } = req.body;
    const { error }  = categoryValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM category WHERE categoryName = $1;',
            [categoryName]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Category is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO category (categoryName) VALUES ($1) RETURNING *;',
            [categoryName]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.error("Error details:", e);
        return { code: 500, status:"fail", message: "Server Error" };
    }
}
const BrandService = async (req) => {
    const { brandName } = req.body;
    const { error }  = brandValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM brands WHERE brandName = $1;',
            [brandName]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Brands is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO brands (brandName) VALUES ($1) RETURNING *;',
            [brandName]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        return { code: 500, status:"fail", message: "Server Error" };
    }
}
const UnitService = async (req) => {
    const { unitName, unitsLabel, relation} = req.body;
    const { error }  = unitValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM units WHERE unitName = $1;',
            [unitName]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Brands is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO units (unitName, unitsLabel, relation) VALUES ($1,$2,$3) RETURNING *;',
            [unitName, unitsLabel, relation]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}

const SupplierService = async (req) => {
    const {supplierName, contactPerson, mobileNumber, address} = req.body;
    const { error }  = supplierValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM supplier WHERE supplierName = $1;',
            [supplierName]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail", message: "Supplier Name is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO supplier (supplierName, contactPerson, mobileNumber, address) VALUES ($1,$2,$3,$4) RETURNING *;',
            [supplierName, contactPerson, mobileNumber, address]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}

const ProductService = async (req) => {
    const { name, categoryid, description,brandid,unitid} = req.body;
    const { error }  = ProductValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM products WHERE name = $1;',
            [name]
        )
        if (existingUser.rows.length > 0) {
            return { code: 403, status:"fail",  message: "Product is already exists." };
        }
        const result = await pool.query(
            'INSERT INTO products (name, categoryid, description,brandid,unitid) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
            [name, categoryid, description,brandid,unitid]
        );
        return { code: 201, status:"success", message: "Successfully Created", data: result.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}


const StockService = async (req) => {
    const { items } = req.body;
    const { error } = StockValidation.validate(req.body, { abortEarly: false });
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        await pool.query("BEGIN");

        const responses = [];

        for (const item of items) {
            const {productid, supplierid, purchaseqty, priceperunit, discount, transportcost} = item;

            const purchaseQuantity = parseFloat(purchaseqty);
            const pricePerUnit = parseFloat(priceperunit);
            const subtotalAmount = (purchaseQuantity * pricePerUnit - parseFloat(discount) + parseFloat(transportcost)).toFixed(2);

            const existingPurchasesResult = await pool.query(
                'SELECT totalpurchaseqty, totalamount FROM stock WHERE productid = $1;', [productid]
            )

            const existingPurchases = existingPurchasesResult.rows;

            const existingQuantity = existingPurchases.reduce((acc, cur) => acc + parseFloat(cur.totalpurchaseqty), 0);
            const existingSubtotal = existingPurchases.reduce((acc, cur) => acc + parseFloat(cur.totalamount), 0);

            let newPurchaseItem;

            if (existingPurchases.length === 0) {
                 newPurchaseItem = await pool.query('INSERT INTO stock (productid, supplierid, purchaseqty, priceperunit,totalpurchaseqty, totalamount, updatetotalpurchaseqty, priceavg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
                    [productid, supplierid, purchaseQuantity, pricePerUnit, purchaseQuantity, subtotalAmount, purchaseQuantity, pricePerUnit]);


                await pool.query('INSERT INTO purchases (productid, supplierid, purchaseqty, priceperunit,totalamount, totalpurchaseqty) VALUES ($1, $2, $3, $4, $5, $6);',
                    [productid, supplierid, purchaseQuantity, pricePerUnit, subtotalAmount, purchaseQuantity]);

            } else {
                const newTotalQuantity = parseFloat((existingQuantity + purchaseQuantity).toFixed(2));
                const newTotalSubtotal = parseFloat((parseFloat(existingSubtotal) + parseFloat(subtotalAmount)).toFixed(2));
                const newPriceAvg = parseFloat((newTotalSubtotal / newTotalQuantity).toFixed(2));


                 newPurchaseItem = await pool.query('UPDATE stock SET supplierid = $1,purchaseqty = $2,priceperunit = $3,totalamount = totalamount + $4,totalpurchaseqty = totalpurchaseqty + $5,updatetotalpurchaseqty = updatetotalpurchaseqty + $6,priceavg = $7 WHERE productid = $8 RETURNING *;',
                    [supplierid, purchaseQuantity, pricePerUnit, subtotalAmount, purchaseQuantity, purchaseQuantity, newPriceAvg, productid]);

                await pool.query('INSERT INTO purchases (productid, supplierid, purchaseqty, priceperunit,totalamount, totalpurchaseqty) VALUES ($1, $2, $3, $4, $5, $6);',
                    [productid, supplierid, purchaseQuantity, pricePerUnit, subtotalAmount, purchaseQuantity]);
            }

            responses.push(newPurchaseItem.rows[0]);
        }

        await pool.query("COMMIT");

        return { code: 201, status: "success", data: responses };
    } catch (e) {
        await pool.query("ROLLBACK");
        console.error(e);
        return { code: 500, status: "fail", message: e.message };
    }
};

const PurchaseSupplierTrackerService = async (req) => {
    const { supplierid, totalCost, paid, currbalance, paymenttype, voucherno } = req.body;

    const { error }  = PurchaseSupplierTrackerValidation.validate(req.body);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    await pool.query("BEGIN");
    try {
        const existingSupplier = await pool.query(
            `SELECT * FROM purchasesuppliertrack WHERE supplierid = $1`,
            [supplierid]
        );
        const updateLedger = await pool.query(
            `INSERT INTO supplierledger (supplierid, paymenttype, credit, debit, balance, voucherno)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [supplierid, paymenttype, totalCost, paid, currbalance, voucherno]
        );
        let updateSuppliertracker;

        if (existingSupplier.rows.length === 0) {
            updateSuppliertracker = await pool.query(
                `INSERT INTO purchasesuppliertrack (supplierid, currbalance, paymenttype)
                 VALUES ($1, $2, $3) RETURNING *`,
                [supplierid, currbalance, paymenttype]
            );
        } else {
            await pool.query(
                `UPDATE purchasesuppliertrack
                 SET currbalance = $1, paymenttype = $2 WHERE supplierid = $3`,
                [currbalance, paymenttype, supplierid]
            );

            updateSuppliertracker = await pool.query(
                `SELECT * FROM purchasesuppliertrack WHERE supplierid = $1`,
                [supplierid]
            );
        }
        await pool.query("COMMIT");
        return {code: 201, status: "success", data: {updateLedger: updateLedger.rows[0], updateSuppliertracker: updateSuppliertracker.rows}};
    } catch (e) {
        await pool.query("ROLLBACK");
        console.error(e);
        return { code: 500, status: "fail", message: e.message};
    }
};
const GetPurchaseSupplierTrackerService = async (req) => {
    const supplierid = parseInt(req.params.supplierid);
    console.log(supplierid);
    const { error }  = GetPurchaseSupplierTrackerValidation.validate(req.params);
    if (error) {
        return { code: 400,status:"fail",message: "Validation Error", data: error.details[0].message };
    }
    try {
        const existingSupplierInfo = await pool.query(
            'SELECT currbalance,paymenttype FROM purchasesuppliertrack WHERE supplierid = $1;',
            [supplierid]
        )
        return { code: 201, status:"success", message: "Successfully fetched", data: existingSupplierInfo.rows };
    } catch (e) {
        console.log(e)
        return { code: 500, status:"fail", message: "Server Error" };
    }
}

const SupplierPurchaseinvoiceService = async (req) => {
    const { supplierid, fromdate, todate } = req.query;
    console.log("query : ", req.query);

    const { error } = SupplierPurchaseinvoiceValidation.validate(req.query);
    if (error) {
        return { code: 400, status: "fail", message: "Validation Error", data: error.details[0].message };
    }

    const SupplierID = parseInt(supplierid);
    let query = `
        SELECT s.suppliername,
               SUM(sl.credit) AS TotalCredit,
               SUM(sl.debit) AS TotalDebit,
               SUM(sl.credit) - SUM(sl.debit) AS Due
        FROM supplierledger sl
                 INNER JOIN supplier s ON s.id = sl.supplierid
        WHERE sl.supplierid = $1
    `;
    const queryParams = [SupplierID];
    if (fromdate) {
        query += ` AND DATE(sl.createdat) >= $${queryParams.length + 1}`;
        queryParams.push(fromdate);
    }
    if (todate) {
        query += ` AND DATE(sl.createdat) <= $${queryParams.length + 1}`;
        queryParams.push(todate);
    }

    query += ` GROUP BY s.suppliername`;

    try {
        const result = await pool.query(query, queryParams);
        return { code: 201, status: "success", message: "Executed Successfully", data: result.rows };
    } catch (e) {
        console.error("Database Error: ", e);
        return { code: 500, status: "fail", message: "Server Error", data: e.message };
    }
};

export {CategoryService,BrandService,UnitService,SupplierService,ProductService,StockService,PurchaseSupplierTrackerService,GetPurchaseSupplierTrackerService,SupplierPurchaseinvoiceService}