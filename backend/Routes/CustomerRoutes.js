const express = require("express");
const PDFDocument = require('pdfkit');
const Customer = require("../Model/CustomerModel");
//insert customer controller 
const CustomerController = require("../Controllers/CustomerControllers")

const router = express.Router();

router.get("/",CustomerController.getAllCustomers);
router.post("/",CustomerController.addCustomers);
router.get("/:id",CustomerController.getById);
router.put("/:id",CustomerController.updatecustomer);
router.delete("/:id",CustomerController.deletecustomer);

//export
module.exports = router;