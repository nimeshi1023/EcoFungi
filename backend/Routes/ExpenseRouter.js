const express = require("express");
const router = express.Router();
const expense = require("../Model/ExpenseModel");
const expenseController = require("../Controllers/ExpenseController");

router.get("/", expenseController.getAllExpense);
router.post("/", expenseController.addExpense);
router.get("/:id", expenseController.getById);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
//export
module.exports = router;