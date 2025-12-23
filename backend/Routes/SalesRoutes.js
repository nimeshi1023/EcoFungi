const express = require("express");
const router = express.Router();

const Sale = require("../Model/SalesModel");
const SaleController = require("../Controllers/SalesControllers");

// CRUD Routes
router.get("/", SaleController.getAllSales);
router.post("/", SaleController.addSales);
router.get("/:id", SaleController.getById);
router.put("/:id", SaleController.updatesale);
router.delete("/:id", SaleController.deletesale);

module.exports = router;
