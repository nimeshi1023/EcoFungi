const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
//insert model
const Stock = require("../Model/StockModel");
const Sale = require("../Model/SalesModel");
//insert product controller 
const StockController = require("../Controllers/StockControllers")

router.get("/",StockController.getAllStocks);
router.post("/",StockController.addStocks);
router.get("/:id",StockController.getById);
router.put("/:id",StockController.updatestock);
router.delete("/:id",StockController.deletestock);

//export
module.exports = router;