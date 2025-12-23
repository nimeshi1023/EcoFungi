import React, { useState } from "react";
import PayNav from "../PayNav/PayNav";
import { useNavigate } from "react-router";
import axios from "axios";

function Employee() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    employee_id: "",
    name: "",
    designation: "",
    email: "",
    phone_number: "",
    working_days: "",
    no_pay_days: "",
    date_of_joining: "",
    status: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setError(""); 
    setSuccess("");
  };

  const validateForm = () => {
    // Name: only alphabets & spaces
    if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
      setError("Name should only contain letters.");
      return false;
    }

    // Email: must contain "@" and end with ".com"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email) || !inputs.email.endsWith(".com")) {
      setError("Email must be valid and end with .com.");
      return false;
    }

    // Phone: must be 10 digits
    if (!/^\d{10}$/.test(inputs.phone_number)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    // Working days: max 31
    if (Number(inputs.working_days) > 31) {
      setError("Working days cannot exceed 31.");
      return false;
    }

    // No pay days: cannot exceed working days
    if (Number(inputs.no_pay_days) > Number(inputs.working_days)) {
      setError("No pay days cannot be greater than working days.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/employees", {
        name: String(inputs.name),
        designation: String(inputs.designation),
        email: String(inputs.email),
        phone_number: String(inputs.phone_number),
        date_of_joining: new Date(inputs.date_of_joining),
        working_days: Number(inputs.working_days),
        no_pay_days: Number(inputs.no_pay_days),
        status: String(inputs.status),
      });

      const employeeId = res.data.employee_id;
      const formattedId = "EMP" + String(employeeId).padStart(3, "0");
      setInputs((prev) => ({ ...prev, employee_id: formattedId }));

      setSuccess("✅ Employee added successfully!");
      setError("");

      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/employeedetails");
      }, 1500);
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("Failed to add employee. Please try again.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-100 text-white">
        <PayNav />
      </aside>

      {/* Main Form */}
      <main className="ml-64 flex-1 flex justify-center items-start min-h-screen bg-gray-100 p-6 pt-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
            👤 Add Employee
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <label className="flex flex-col text-gray-700 font-medium">
              Name:
              <input
                type="text"
                name="name"
                required
                value={inputs.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* Designation */}
            <label className="flex flex-col text-gray-700 font-medium">
              Designation:
              <input
                type="text"
                name="designation"
                value={inputs.designation}
                onChange={handleChange}
                placeholder="Job Title"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* Email */}
            <label className="flex flex-col text-gray-700 font-medium">
              Email:
              <input
                type="email"
                name="email"
                required
                value={inputs.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* Phone Number */}
            <label className="flex flex-col text-gray-700 font-medium">
              Phone Number:
              <input
                type="text"
                name="phone_number"
                required
                value={inputs.phone_number}
                onChange={handleChange}
                placeholder="10-digit number"
                maxLength={10}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* Date of Joining */}
            <label className="flex flex-col text-gray-700 font-medium">
              Date of Joining:
              <input
                type="date"
                name="date_of_joining"
                required
                value={inputs.date_of_joining}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* Working Days */}
            <label className="flex flex-col text-gray-700 font-medium">
              Working Days:
              <input
                type="number"
                name="working_days"
                required
                value={inputs.working_days}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </label>

            {/* No Pay Days */}
            <label className="flex flex-col text-gray-700 font-medium">
              No Pay Days:
              <input
                type="number"
                name="no_pay_days"
                required
                value={inputs.no_pay_days}
                onChange={handleChange}
                className="mt-1 p-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </label>

            {/* Status */}
            <label className="flex flex-col text-gray-700 font-medium">
              Status:
              <select
                name="status"
                required
                value={inputs.status}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="">-- Select Status --</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              Add Employee
            </button>
          </form>

          {/* Display formatted Employee ID */}
          {inputs.employee_id && (
            <p className="mt-4 text-gray-700">
              Employee Details added successfully
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Employee;
