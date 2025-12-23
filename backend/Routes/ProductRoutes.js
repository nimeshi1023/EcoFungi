const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
//insert model
const Product = require("../Model/ProductModel");
const Sale = require("../Model/SalesModel");
//insert product controller 
const ProductController = require("../Controllers/ProductControllers")

router.get("/",ProductController.getAllProducts);
router.post("/",ProductController.addProducts);
router.get("/:id",ProductController.getById);
router.put("/:id",ProductController.updateproduct);
router.delete("/:id",ProductController.deleteproduct);


//export
module.exports = router;