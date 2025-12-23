import axios from "axios";
import React, { useState, useEffect } from "react";
import PayNav from "../PayNav/PayNav";
import Salary from "../Salary/Salary";

const URL = "http://localhost:5000/salaries";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Paydetails() {
  const [salaries, setSalary] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setSalary(data.salaries));
  }, []);

  // 🔹 Filter salaries by employee_id, name, and month
  const filteredSalaries = salaries.filter((sal) => {
    const matchesId = searchId
      ? sal.employee_id.toString().includes(searchId.trim())
      : true;

    const matchesName = searchName
       ? sal.name.toLowerCase().startsWith(searchName.trim().toLowerCase())
      : true; 

    const matchesMonth = filterMonth ? sal.month === filterMonth : true;

    return matchesId && matchesName && matchesMonth;
  });

  // 🔹 Calculate total expenses
  const totalExpenses = filteredSalaries.reduce((sum, sal) => {
    return sum + (sal.totals?.netSalary || 0);
  }, 0);

  // 🔹 Clear filters
  const clearFilters = () => {
    setSearchId("");
    setSearchName("");
    setFilterMonth("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <PayNav />

      {/* Content Area */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">
          All Salary Details
        </h1>

        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          {/* Search by Employee ID */}
          <input
            type="text"
            placeholder="Search by Employee ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />

          {/* Search by Employee Name */}
          <input
            type="text"
            placeholder="Search by Employee Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />

          {/* Filter by Month */}
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Clear
          </button>
        </div>

        {/* Total Expenses */}
        <div className="mb-6 font-semibold text-lg text-[#2E7D32]">
          Total Salaries: Rs {totalExpenses.toFixed(2)}
        </div>

        {/* Salary Cards */}
        <div className="w-full flex flex-col gap-6">
          {filteredSalaries.length > 0 ? (
            filteredSalaries.map((sal, i) => <Salary key={i} sal={sal} />)
          ) : (
            <p className="text-center text-gray-500 font-medium">
              No salaries found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Paydetails;
