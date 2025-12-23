const express = require("express");
const PDFDocument = require("pdfkit");
const Order = require("../Model/OrderModel");
const OrderController = require("../Controllers/OrderControllers");

const router = express.Router();

//  CRUD routes
router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addOrder);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);


//export
module.exports = router;
