import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Salary({ sal }) {
  const {
    _id,
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
    createdAt,
    updatedAt,
  } = sal;

  const navigate = useNavigate();

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary record?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/salaries/${_id}`);
      alert("Salary record deleted successfully ✅");
      navigate(0); // refresh page
    } catch (err) {
      console.error("Failed to delete salary:", err);
      alert("❌ Failed to delete salary. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Employee ID: <span className="text-green-700">{employee_id}</span>
          </h2>
          <p className="text-gray-800 font-medium">Name: {name}</p>
          <p className="text-gray-600">Designation: {designation}</p>
          <p className="text-gray-600">Month: {month}</p>
        </div>
        <div className="text-right text-gray-500 text-xs md:text-sm">
          <p>📅 Created: {new Date(createdAt).toLocaleDateString()}</p>
          <p>✏️ Updated: {new Date(updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Salary Details */}
      <div className="flex flex-col md:flex-row gap-8 mb-4">
        {/* Earnings */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="font-semibold text-green-700 mb-3">💰 Earnings</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>Basic Salary: <span className="font-medium">Rs {basicSalary?.toLocaleString()}</span></li>
            <li>
              Overtime — Hours: {overtime?.hours || 0}, Days: {overtime?.days || 0}, Pay:{" "}
              <span className="font-medium">Rs {overtime?.pay?.toLocaleString() || 0}</span>
            </li>
            <li>
              Bonus — Rate: {bonus?.rate || 0}%, Amount:{" "}
              <span className="font-medium">Rs {bonus?.amount?.toLocaleString() || 0}</span>
            </li>
            {allowances && allowances.length > 0 ? (
              allowances.map((a, index) => (
                <li key={index}>
                  {a.name}: <span className="font-medium">Rs {a.amount?.toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li>Allowances: None</li>
            )}
          </ul>
        </div>

        {/* Deductions */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="font-semibold text-red-700 mb-3">📉 Deductions</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>No Pay: <span className="font-medium">Rs {deductions?.noPay?.toLocaleString() || 0}</span></li>
            <li>EPF: <span className="font-medium">Rs {deductions?.epf?.toLocaleString() || 0}</span></li>
            <li>APIT: <span className="font-medium">Rs {deductions?.apit?.toLocaleString() || 0}</span></li>
            <li>Other: <span className="font-medium">Rs {deductions?.other?.toLocaleString() || 0}</span></li>
          </ul>
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 mb-5">
        <p className="font-medium text-gray-800">
          Total Allowances:{" "}
          <span className="font-semibold text-green-700">
            Rs {totals?.totalAllowances?.toLocaleString() || 0}
          </span>
        </p>
        <p className="font-medium text-gray-800">
          Total Deductions:{" "}
          <span className="font-semibold text-red-700">
            Rs {totals?.totalDeductions?.toLocaleString() || 0}
          </span>
        </p>
        <p className="text-lg font-bold text-green-800 mt-3">
          Net Salary: Rs {totals?.netSalary?.toLocaleString() || 0}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mt-auto">
        <Link
          to={`/Paydetails/${_id}`}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-sm transition"
        >
          Update
        </Link>
        <button
          onClick={deleteHandler}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
        >
          Delete
        </button>
        <Link
          to={`/salarySlip/${_id}`}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
        >
          View Slip
        </Link>
      </div>
    </div>
  );
}

export default Salary;
