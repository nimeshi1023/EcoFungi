const express = require("express");
const router = express.Router();
const salary = require("../Model/SalaryModel");
const salaryController = require("../Controllers/SalaryController");

router.get("/", salaryController.getAllSalaries);
router.post("/", salaryController.addSalary);
router.get("/:id", salaryController.getSalaryById);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);
//export
module.exports = router;