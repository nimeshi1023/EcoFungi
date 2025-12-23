const express = require("express");
const router = express.Router();
const employeeController = require("../Controllers/EmployeeController");

// Get all employees
router.get("/", employeeController.getAllEmployee);

// Add new employee
router.post("/", employeeController.addEmployee);

// Get employee by employee_id
router.get("/:id", employeeController.getEmpById);

// Update employee by employee_id
router.put("/:id", employeeController.updateEmployee);

// Delete employee by employee_id
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
