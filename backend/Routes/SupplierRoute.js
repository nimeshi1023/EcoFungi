const express=require("express");
const router=express.Router();

const Supplier=require("../Model/SupplierModel")

const SupplierController=require("../Controllers/SupplierController")

router.get("/",SupplierController.getAllSupplier);
router.post("/",SupplierController.addSupplier);
router.get("/:id",SupplierController.getById);
router.put("/:id",SupplierController.updateSupplier);
router.delete("/:id",SupplierController.deleteSupplier);

module.exports=router;