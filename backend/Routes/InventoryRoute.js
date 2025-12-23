const express=require("express");
const router=express.Router();

const Inventory=require("../Model/InventoryModel")

const InventoryController=require("../Controllers/InventoryController")

router.get("/",InventoryController.getAllInventory);
router.post("/",InventoryController.addInventory);
router.get("/:id",InventoryController.getById);
router.put("/:id",InventoryController.updateInventory);
router.delete("/:id",InventoryController.deleteInventory);

module.exports=router;