const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Salary Schema
const salarySchema = new Schema({
  employee_id: { type: String, required: true },       // Employee ID
  name: { type: String, required: true },
  designation: { type: String, required: true },
  month: { type: String, required: true },   // Salary month (YYYY-MM)
  basicSalary: { type: Number, default: 0 },          // Basic salary
  overtime: {
      hours: {
        type: Number,
        default: 0,
        min: [0, "Overtime hours cannot be negative"],
      },
      days: {
        type: Number,
        default: 0,
        min: [0, "Overtime days cannot be negative"],
        max: [31, "Overtime days cannot exceed 31"],
      },
      pay: { type: Number, default: 0, min: 0 },
    },

    // ✅ Bonus validations
    bonus: {
      rate: {
        type: Number,
        default: 0,
        min: [0, "Bonus rate cannot be negative"],
        max: [100, "Bonus rate cannot exceed 100%"],
      },
      amount: { type: Number, default: 0, min: 0 },
    },

    // ✅ Allowances validations
    allowances: [
      {
        name: { type: String, trim: true },
        amount: {
          type: Number,
          default: 0,
          min: [0, "Allowance cannot be negative"],
          max: [1000000, "Allowance cannot exceed 1,000,000"],
        },
      },
    ],

    // ✅ Deductions validations
    deductions: {
      noPay: { type: Number, default: 0, min: 0 },
      epf: { type: Number, default: 0, min: 0 },
      apit: { type: Number, default: 0, min: 0 },
      other: {
        type: Number,
        default: 0,
        min: [0, "Other deduction cannot be negative"],
        max: [1000000, "Other deduction cannot exceed 1,000,000"],
      },
    },

    // ✅ Totals (auto-calculated later, but keep non-negative)
    totals: {
      totalAllowances: { type: Number, default: 0, min: 0 },
      totalDeductions: { type: Number, default: 0, min: 0 },
      netSalary: { type: Number, default: 0, min: 0 },
    },
    }, { timestamps: true });

// Auto-increment salary_id
salarySchema.plugin(AutoIncrement, { inc_field: "salary_id" });

module.exports = mongoose.model("SalaryModel", salarySchema);
