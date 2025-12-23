//import React from 'react'
import axios from "axios";
import React, { useState, useEffect } from "react";
import PayNav from "../PayNav/PayNav";
import Exp from "../Emp/Emp";

const URL = "http://localhost:5000/employees";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function EmpDetails() {
  const [employees, setEmployee] = useState();

  useEffect(() => {
    fetchHandler().then((data) => setEmployee(data.employees));
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <PayNav />

      {/* Main Content (pushed right by ml-52) */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52">
        <h1 className="text-center text-2xl font-bold text-[#1B5E20] mb-6">
          Employee Details
        </h1>

        {/* Topic: Details for November */}
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          📅 Details for September
        </h2>

        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
              <tr>
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Date of Joining</th>
                <th className="px-4 py-2">Working Days</th>
                <th className="px-4 py-2">No Pay Days</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {employees &&
                employees.map((emp, i) => <Exp key={i} emp={emp} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmpDetails;
