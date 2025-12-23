const SalaryModel = require("../Model/SalaryModel");

// Get all salaries
const getAllSalaries = async (req, res, next) => {
  let salaries;
  try {
    salaries = await SalaryModel.find();
  } catch (err) {
    console.log(err);
  }

  if (!salaries) {
    return res.status(404).json({ message: "Salaries not found" });
  }

  return res.status(200).json({ salaries });
};

// Add a new salary
const addSalary = async (req, res, next) => {
  const {
    employee_id,
    name,
    designation,
    month,
    basicSalary,
    overtime,
    bonus,
    allowances,
    deductions,
    totals,
  } = req.body;

  let salary;
  try {
    salary = new SalaryModel({
      employee_id,
      name,
      designation,
      month,
      basicSalary,
      overtime,
      bonus,
      allowances,
      deductions,
      totals,
    });

    await salary.save();
  } catch (err) {
    console.log(err);
  }

  if (!salary) {
    return res.status(404).json({ message: "Unable to add salary" });
  }

  return res.status(200).json({ salary });
};

// Get salary by ID
const getSalaryById = async (req, res, next) => {
  const id = req.params.id;

  let salary;
  try {
    salary = await SalaryModel.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!salary) {
    return res.status(404).json({ message: "Salary not found" });
  }

  return res.status(200).json({ salary });
};

// Update salary by ID
const updateSalary = async (req, res, next) => {
  const id = req.params.id;
  const {
    employee_id,
    name,
    designation,
    month,
    basicSalary,
    overtime,
    bonus,
    allowances,
    deductions,
    totals,
  } = req.body;

  let salary;
  try {
    salary = await SalaryModel.findByIdAndUpdate(
      id,
      {
        employee_id,
        name,
        designation,
        month,
        basicSalary,
        overtime,
        bonus,
        allowances,
        deductions,
        totals,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (!salary) {
    return res.status(404).json({ message: "Salary not found" });
  }

  return res.status(200).json({ salary });
};

// Delete salary by ID
const deleteSalary = async (req, res, next) => {
  const id = req.params.id;

  let salary;
  try {
    salary = await SalaryModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!salary) {
    return res.status(404).json({ message: "Unable to delete salary" });
  }

  return res.status(200).json({ salary });
};

exports.getAllSalaries = getAllSalaries;
exports.addSalary = addSalary;
exports.getSalaryById = getSalaryById;
exports.updateSalary = updateSalary;
exports.deleteSalary = deleteSalary;
