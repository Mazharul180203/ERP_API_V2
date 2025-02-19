import express from "express";

import * as AuthController from "../controllers/AuthController.js"
import AuthVarification from "../middlewares/AuthVarification.js";
import * as ProductController from "../controllers/ProductController.js";
import * as CustomerController from "../controllers/CustomerController.js";
import * as SaleController from "../controllers/SaleController.js";
import * as DropdownController from "../controllers/DropdownController.js";
import * as Userdetails from "../controllers/Userdetails.js";


const router = express.Router();

//Authentication
router.post('/Registration', AuthController.Registration);
router.post('/VerifyLogin',AuthController.VerifyLogin);
router.post('/AuthDestroy',AuthController.AuthDestroy);

router.post('/userdetails',AuthVarification,Userdetails.userdetails);



router.post('/category',AuthVarification,ProductController.category)
router.post('/brands',AuthVarification,ProductController.brands)
router.post('/units',AuthVarification,ProductController.units)
router.post('/product',AuthVarification,ProductController.product)
router.post('/stock',AuthVarification,ProductController.stock)
router.post('/purchasesuppliertracker',AuthVarification,ProductController.purchasesuppliertracker)
router.get('/supplierpurchaseinvoice',AuthVarification,ProductController.supplierpurchaseinvoice)

router.post('/supplier',AuthVarification,ProductController.supplier)
router.get('/getpurchasesuppliertracker/:supplierid',AuthVarification,ProductController.getpurchasesuppliertracker)

router.get('/dropdown/:type',AuthVarification,DropdownController.dropdown)

router.post('/customertype',AuthVarification,CustomerController.customertype)
router.post('/customer',AuthVarification,CustomerController.customer)
router.get('/customerledgerinvoice',AuthVarification,CustomerController.customerledgerinvoice)

router.post('/saleproduct',AuthVarification,SaleController.saleproduct)
router.post('/salesCustomerTracker',AuthVarification,SaleController.salesCustomerTracker)
router.get('/getsalescustomertracker/:customerid',AuthVarification,SaleController.getsalescustomertracker)
router.get('/salesinvoice',AuthVarification,SaleController.salesinvoice)




export default router;