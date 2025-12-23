const Employee = require("../Model/EmployeeModel");

// Get all employees
const getAllEmployee = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json({ employees });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add new employee
const addEmployee = async (req, res, next) => {
  const {
    name,
    designation,
    email,
    phone_number,
    date_of_joining,
    working_days,
    no_pay_days,
    status,
  } = req.body;

  try {
    const employee = new Employee({
      name,
      designation,
      email,
      phone_number,
      date_of_joining,
      working_days,
      no_pay_days,
      status,
    });
    await employee.save();
    return res.status(201).json({ employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add employee" });
  }
};

// Get employee by employee_id
const getEmpById = async (req, res, next) => {
  const empId = parseInt(req.params.id, 10); // convert string → number
  try {
    const employee = await Employee.findOne({ employee_id: empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update employee by employee_id
const updateEmployee = async (req, res, next) => {
  const empId = parseInt(req.params.id, 10);
  const {
    name,
    designation,
    email,
    phone_number,
    date_of_joining,
    working_days,
    no_pay_days,
    status,
  } = req.body;

  try {
    const employee = await Employee.findOneAndUpdate(
      { employee_id: empId },
      { name, designation, email, phone_number, date_of_joining, working_days, no_pay_days, status },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete employee by employee_id
const deleteEmployee = async (req, res, next) => {
  const empId = parseInt(req.params.id, 10);
  try {
    const employee = await Employee.findOneAndDelete({ employee_id: empId });
    if (!employee) {
      return res.status(404).json({ message: "Unable to delete employee" });
    }
    return res.status(200).json({ employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEmployee = getAllEmployee;
exports.addEmployee = addEmployee;
exports.getEmpById = getEmpById;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
