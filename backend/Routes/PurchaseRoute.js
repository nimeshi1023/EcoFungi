const express=require("express");
const router=express.Router();

const Purchase=require("../Model/PurchaseModel")

const PurchaseController=require("../Controllers/PurchaseController")

router.get("/",PurchaseController.getAllPurchase);
router.post("/",PurchaseController.addPurchase);
router.get("/:id",PurchaseController.getById);
router.put("/:id",PurchaseController.updatePurchase);
router.delete("/:id",PurchaseController.deletePurchase);

module.exports=router;