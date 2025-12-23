const express=require("express");
const router=express.Router();
const Bagiteam=require("../Model/BagItem");
const BagiteamController=require("../Controllers/bagController");




router.post("/", BagiteamController.createBag);   // Create bag
router.get("/", BagiteamController.getAllBags);   // Get all bags
router.put("/:id", BagiteamController.updateBag); // Update bag items
router.delete("/:id", BagiteamController.deleteBag); // Delete bag


module.exports=router;