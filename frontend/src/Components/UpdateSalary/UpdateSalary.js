import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import PayNav from "../PayNav/PayNav";

function UpdateSalary() {
  const { id } = useParams();
  const navigate = useNavigate();

  // -------------------- State --------------------
  const [inputs, setInputs] = useState({
    salary_id: "",
    employee_id: "",
    name: "",
    designation: "",
    month: "",
    basicSalary: "",
    overtime: { hours: "", days: "", pay: "" },
    bonus: { rate: "", amount: "" },
    allowances: [{ name: "", amount: "" }],
    deductions: { noPay: "", epf: "", apit: "", other: "" },
  });

  const [employees, setEmployees] = useState([]);
  const [workingDays, setWorkingDays] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");


  const toNumber = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

  // -------------------- Fetch employees --------------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employees");
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // -------------------- Fetch existing salary --------------------
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/salaries/${id}`);
        if (res.data && res.data.salary) {
          setInputs(res.data.salary);

          const emp = employees.find(
            (e) => String(e.employee_id) === String(res.data.salary.employee_id)
          );
          if (emp) setWorkingDays(emp.working_days ?? emp.workingDays ?? null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSalary();
  }, [id, employees]);

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setInputs((prev) => ({ ...prev, employee_id: empId }));

    if (!empId) {
      setWorkingDays(null);
      return;
    }

    const emp = employees.find((emp) => String(emp.employee_id) === String(empId));
    if (emp) {
      setInputs((prev) => ({
        ...prev,
        name: emp.name ?? "",
        designation: emp.designation ?? "",
      }));
      setWorkingDays(emp.working_days ?? emp.workingDays ?? null);
    }
  };

  const handleOvertimeChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      overtime: { ...prev.overtime, [field]: value },
    }));
  };

  const handleBonusChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      bonus: { ...prev.bonus, [field]: value },
    }));
  };

  const handleAllowanceChange = (index, field, value) => {
    const newAllowances = [...inputs.allowances];
    newAllowances[index][field] = value;
    setInputs((prev) => ({ ...prev, allowances: newAllowances }));
  };

  const addAllowance = () => {
    setInputs((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { name: "", amount: "" }],
    }));
  };

  const removeAllowance = (index) => {
    const newAllowances = inputs.allowances.filter((_, i) => i !== index);
    setInputs((prev) => ({ ...prev, allowances: newAllowances }));
  };

  const handleDeductionChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [field]: value },
    }));
  };

  // -------------------- Auto calculations --------------------
  const calcOtPay = (basic, wd, hours, days) => {
    if (!wd || wd <= 0) return 0;
    return (basic / (wd * 8)) * hours * days;
  };

  useEffect(() => {
    const otPay = calcOtPay(
      toNumber(inputs.basicSalary),
      workingDays,
      toNumber(inputs.overtime.hours),
      toNumber(inputs.overtime.days)
    );

    setInputs((prev) => ({
      ...prev,
      overtime: { ...prev.overtime, pay: otPay },
    }));
  }, [inputs.basicSalary, inputs.overtime.hours, inputs.overtime.days, workingDays]);

  useEffect(() => {
    const bonusAmount = (toNumber(inputs.basicSalary) * toNumber(inputs.bonus.rate)) / 100;
    setInputs((prev) => ({ ...prev, bonus: { ...prev.bonus, amount: bonusAmount } }));
  }, [inputs.basicSalary, inputs.bonus.rate]);

  // EPF 8%
  useEffect(() => {
    const epf = (toNumber(inputs.basicSalary) * 8) / 100;
    setInputs((prev) => ({ ...prev, deductions: { ...prev.deductions, epf } }));
  }, [inputs.basicSalary]);

  const calcAPIT = (gross) => {
    let tax = 0;
    if (gross <= 150000) tax = 0;
    else if (gross <= 233333) tax = (gross - 150000) * 0.06;
    else if (gross <= 275000) tax = (233333 - 150000) * 0.06 + (gross - 233333) * 0.18;
    else if (gross <= 316666)
      tax = (233333 - 150000) * 0.06 + (275000 - 233333) * 0.18 + (gross - 275000) * 0.24;
    else if (gross <= 358333)
      tax =
        (233333 - 150000) * 0.06 +
        (275000 - 233333) * 0.18 +
        (316666 - 275000) * 0.24 +
        (gross - 316666) * 0.3;
    else
      tax =
        (233333 - 150000) * 0.06 +
        (275000 - 233333) * 0.18 +
        (316666 - 275000) * 0.24 +
        (358333 - 316666) * 0.3 +
        (gross - 358333) * 0.36;
    return tax;
  };

  const totalAllowances = Number(
  (
    inputs.allowances.reduce((sum, a) => sum + toNumber(a.amount), 0) +
    toNumber(inputs.overtime.pay) +
    toNumber(inputs.bonus.amount)
  ).toFixed(2)
);

  const totalDeductions = Number(
  (
    toNumber(inputs.deductions.noPay) +
    toNumber(inputs.deductions.epf) +
    toNumber(inputs.deductions.apit) +
    toNumber(inputs.deductions.other)
  ).toFixed(2)
);

const netSalary = Number(
  (toNumber(inputs.basicSalary) + totalAllowances - totalDeductions).toFixed(2)
);


  useEffect(() => {
    const gross = toNumber(inputs.basicSalary) + totalAllowances;
    const apit = calcAPIT(gross);
    setInputs((prev) => ({ ...prev, deductions: { ...prev.deductions, apit } }));
  }, [inputs.basicSalary, totalAllowances]);

   // ------------ VALIDATION FUNCTION ------------
  const validateForm = () => {
    const newErrors = {};

    // Month validation (not in future)
    if (inputs.month) {
      const selectedDate = new Date(inputs.month + "-01");
      const now = new Date();
      if (selectedDate > now) {
        newErrors.month = "Month cannot be in the future";
      }
    } else {
      newErrors.month = "Month is required";
    }

    // OT hours
    if (toNumber(inputs.overtime.hours) > 24) {
      newErrors.otHours = "OT Hours cannot exceed 24";
    }

    // OT days
    if (toNumber(inputs.overtime.days) < 0) {
      newErrors.otDays = "OT Days cannot be negative";
    } else if (toNumber(inputs.overtime.days) > 31) {
      newErrors.otDays = "OT Days cannot exceed 31";
    }

    // Bonus rate
    if (toNumber(inputs.bonus.rate) < 0) {
      newErrors.bonusRate = "Bonus rate cannot be negative";
    } else if (toNumber(inputs.bonus.rate) > 100) {
      newErrors.bonusRate = "Bonus rate cannot exceed 100%";
    }
    //basic
    if (inputs.basicSalary === "" || inputs.basicSalary === null) {
    newErrors.basicSalary = "Basic Salary is required";
    } else if (toNumber(inputs.basicSalary) < 0) {
    newErrors.basicSalary = "Basic Salary cannot be negative";
    } 

    // ----------------- Allowances Validation -----------------
    inputs.allowances.forEach((allowance, index) => {
      // Only validate if allowance name is selected
      if (allowance.name) {
      if (allowance.amount === "" || toNumber(allowance.amount) <= 0) {
      newErrors[`allowanceAmount${index}`] = "Allowance amount must be greater than 0";
    }
    }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await axios.put(`http://localhost:5000/salaries/${id}`, {
        employee_id: String(inputs.employee_id),
        month: String(inputs.month),
        name: inputs.name,
        designation: inputs.designation,
        basicSalary: toNumber(inputs.basicSalary),
        overtime: {
          hours: toNumber(inputs.overtime.hours),
          days: toNumber(inputs.overtime.days),
          pay: toNumber(inputs.overtime.pay),
        },
        bonus: {
          rate: toNumber(inputs.bonus.rate),
          amount: toNumber(inputs.bonus.amount),
        },
        allowances: inputs.allowances.map((a) => ({ name: a.name, amount: toNumber(a.amount) })),
        deductions: {
          noPay: toNumber(inputs.deductions.noPay),
          epf: toNumber(inputs.deductions.epf),
          apit: toNumber(inputs.deductions.apit),
          other: toNumber(inputs.deductions.other),
        },
        totals: {
          totalAllowances,
          totalDeductions,
          netSalary: Number(netSalary.toFixed(2)),
        },
      });
     setSuccessMessage("Salary updated successfully!");

    // Optionally, navigate after 2-3 seconds
    setTimeout(() => {
      navigate("/paymentdetails");
    }, 2000);
    } catch (err) {
    console.error("Error updating salary:", err);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="flex">
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-100 text-white">
        <PayNav />
      </aside>

      <main className="ml-64 flex-1 flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold">Salary Slip Form</h1>
            <p className="text-gray-600">Update employee salary details</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <select
                name="employee_id"
                value={inputs.employee_id}
                onChange={handleEmployeeChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="">Select Employee ID</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id}
                  </option>
                ))}
              </select>
              {/* Show working days if available */}
              {workingDays ? (
                <p className="mt-1 text-sm text-gray-600">
                  Working Days : <span className="font-medium">{workingDays}</span>
                </p>
              ) : (
                inputs.employee_id && (
                  <p className="mt-1 text-sm text-red-600">
                    Working days not found for selected employee.
                  </p>
                )
              )}
            </div>

            {/* name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="name"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

             {/* designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="designation"
                name="designation"
                value={inputs.designation}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              />
            </div>


            {/* Month */}
            <div>
              <label className="block text-sm font-medium">Month</label>
              <input
                type="month"
                name="month"
                value={inputs.month}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, month: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
              />
              {errors.month && (
                <p className="text-red-500 text-sm">{errors.month}</p>
              )}
            </div>

            {/* Basic Salary */}
            <div>
            <label className="block text-sm font-medium">Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={inputs.basicSalary}
                onChange={(e) =>
                setInputs((prev) => ({ ...prev, basicSalary: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                />
            {errors.basicSalary && (
            <p className="text-red-500 text-sm">{errors.basicSalary}</p>
            )}
            </div>

            {/* Overtime & Bonus */}
            <h2 className="font-semibold mt-6">Overtime & Bonus</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium">OT Hours</label>
              <input
                type="number"
                value={inputs.overtime.hours}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    overtime: { ...prev.overtime, hours: e.target.value },
                  }))
                }
                className="w-full border rounded-lg p-2"
              />
              {errors.otHours && (
                <p className="text-red-500 text-sm">{errors.otHours}</p>
              )}
            </div>

              <div>
              <label className="block text-sm font-medium">OT Days</label>
              <input
                type="number"
                value={inputs.overtime.days}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    overtime: { ...prev.overtime, days: e.target.value },
                  }))
                }
                className="w-full border rounded-lg p-2"
              />
              {errors.otDays && (
                <p className="text-red-500 text-sm">{errors.otDays}</p>
              )}
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">OT Pay</label>
                <input
                  type="number"
                  value={Number(inputs.overtime.pay || 0).toFixed(2)}
                  readOnly
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 bg-gray-100"
                />
              </div>
              <br></br>

              <div>
              <label className="block text-sm font-medium">Bonus Rate (%)</label>
              <input
                type="number"
                value={inputs.bonus.rate}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    bonus: { ...prev.bonus, rate: e.target.value },
                  }))
                }
                className="w-full border rounded-lg p-2"
              />
              {errors.bonusRate && (
                <p className="text-red-500 text-sm">{errors.bonusRate}</p>
              )}
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bonus Amount</label>
                <input
                  type="number"
                  value={inputs.bonus.amount}
                  onChange={(e) => handleBonusChange("amount", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>

           {/* Allowances */}
           {inputs.allowances.map((allowance, index) => (
            <div key={index} className="flex flex-col gap-1">
            <div className="flex gap-2">
            <select
              value={allowance.name}
              onChange={(e) => handleAllowanceChange(index, "name", e.target.value)}
              className="flex-1 rounded-lg border border-green-300 p-2"
              >
              <option value="">-- Select Allowance --</option>
              <option value="Cost of Living Allowance">Cost of Living Allowance</option>
              <option value="Food Allowance">Food Allowance</option>
              <option value="Conveyance Allowance">Conveyance Allowance</option>
              <option value="Medical Allowance">Medical Allowance</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={allowance.amount}
              onChange={(e) => handleAllowanceChange(index, "amount", e.target.value)}
              className="w-40 rounded-lg border border-green-300 p-2"
            />

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeAllowance(index)}
                className="bg-red-600 text-white px-3 rounded-lg"
              >
                X
              </button>
            )}
          </div>

          {/* Error message */}
          {errors[`allowanceAmount${index}`] && (
          <p className="text-red-500 text-sm">{errors[`allowanceAmount${index}`]}</p>
          )}
          </div>
          ))}


            <button
              type="button"
              onClick={addAllowance}
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded-xl"
            >
              + Add Allowance
            </button>

            {/* Deductions */}
            <h2 className="font-semibold mt-6">Deductions</h2>
            <div className="grid grid-cols-2 gap-4">
              {["noPay", "epf", "apit", "other"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field === "noPay" ? "No Pay Deduction" : field.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={Number(inputs.deductions[field] || 0).toFixed(2)} 
                    onChange={(e) => handleDeductionChange(field, e.target.value)}
                    readOnly={field === "epf" || field === "apit"} 
                    className="mt-1 w-full rounded-lg border border-red-300 p-2"
                  />
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex justify-between font-semibold">
              <span>Total Allowances</span>
              <span>Rs {Number(totalAllowances).toLocaleString()}</span>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex justify-between font-semibold text-red-600">
              <span>Total Deductions</span>
              <span>Rs {Number(totalDeductions).toLocaleString()}</span>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg flex justify-between font-bold text-green-700">
              <span>Net Salary</span>
              <span>Rs {Number(netSalary).toLocaleString()}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-400 text-white py-2 px-4 rounded-xl mt-4"
            >
              Update Salary
            </button>
          </form>
          {successMessage && (
          <div className="mb-4 p-3 bg-green-200 text-green-800 rounded-lg text-center font-semibold">
            {successMessage}
            </div>
          )}
          </div>
      </main>
    </div>
  );
}

export default UpdateSalary;
