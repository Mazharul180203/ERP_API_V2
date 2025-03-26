import express from "express";

import * as AuthController from "../controllers/AuthController.js"
import AuthVarification from "../middlewares/AuthVarification.js";
import * as ProductController from "../controllers/ProductController.js";
import * as CustomerController from "../controllers/CustomerController.js";
import * as SaleController from "../controllers/SaleController.js";
import * as DropdownController from "../controllers/DropdownController.js";
import * as Userdetails from "../controllers/Userdetails.js";
import {checkPermission} from "../middlewares/PermissionVarification.js";


const router = express.Router();

//Authentication
router.post('/Registration', AuthController.Registration);
router.post('/VerifyLogin',AuthController.VerifyLogin);
router.post('/refreshtoken',AuthController.refreshtoken)
router.post('/AuthDestroy',AuthController.AuthDestroy);

router.post('/userdetails',AuthVarification,checkPermission('userdetails'),Userdetails.userdetails);
router.post('/sendmail',AuthVarification,checkPermission('sendmail'),Userdetails.sendmail)


router.post('/category',AuthVarification,checkPermission('createCategory'),ProductController.category)
router.post('/brands',AuthVarification,checkPermission('createBrands'),ProductController.brands)
router.post('/units',AuthVarification,checkPermission('createUnits'),ProductController.units)
router.post('/product',AuthVarification,checkPermission('createProducts'),ProductController.product)
router.post('/stock',AuthVarification,checkPermission('viewStock'),ProductController.stock)
router.post('/purchasesuppliertracker',AuthVarification,checkPermission('purchaseSupplierTracker'),ProductController.purchasesuppliertracker)
router.get('/supplierpurchaseinvoice',AuthVarification,checkPermission('supplierPurchaseInvoice'),ProductController.supplierpurchaseinvoice)

router.post('/supplier',AuthVarification,checkPermission('createSupplier'),ProductController.supplier)
router.get('/getpurchasesuppliertracker/:supplierid',AuthVarification,checkPermission('getPurchaseSupplierTracker'),ProductController.getpurchasesuppliertracker)

router.get('/dropdown/:type',AuthVarification,checkPermission('dropdown'),DropdownController.dropdown)

router.post('/customertype',AuthVarification,checkPermission('customerType'),CustomerController.customertype)
router.post('/customer',AuthVarification,checkPermission('createCustommer'),CustomerController.customer)
router.get('/customerledgerinvoice',AuthVarification,checkPermission('customerLedgerInvoice'),CustomerController.customerledgerinvoice)

router.post('/saleproduct',AuthVarification,checkPermission('saleProduct'),SaleController.saleproduct)
router.post('/salesCustomerTracker',AuthVarification,checkPermission('salesCustomerTracker'),SaleController.salesCustomerTracker)
router.get('/getsalescustomertracker/:customerid',AuthVarification,checkPermission('getSalesCustomerTracker'),SaleController.getsalescustomertracker)
router.get('/salesinvoice',AuthVarification,checkPermission('salesInvoice'),SaleController.salesinvoice)




export default router;