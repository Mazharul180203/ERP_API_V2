import {
    BrandService,
    CategoryService,
    SupplierService,
    UnitService,
    ProductService,
    StockService, PurchaseSupplierTrackerService, GetPurchaseSupplierTrackerService,SupplierPurchaseinvoiceService
} from "../services/ItemService.js";


export const category =  async (req,res) =>{
    let response = await CategoryService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const brands =  async (req,res) =>{
    let response = await BrandService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const units =  async (req,res) =>{
    let response = await UnitService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const supplier =  async (req,res) =>{
    let response = await SupplierService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const  product =  async (req,res) =>{
    let response = await ProductService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const  stock =  async (req,res) =>{
    let response = await StockService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const  purchasesuppliertracker =  async (req,res) =>{
    let response = await PurchaseSupplierTrackerService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

export const  getpurchasesuppliertracker =  async (req,res) =>{
    let response = await GetPurchaseSupplierTrackerService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}
export const  supplierpurchaseinvoice =  async (req,res) =>{
    let response = await SupplierPurchaseinvoiceService(req);
    res.status(response.code).json({status: response.status,message: response.message, data: response.data || null });

}

