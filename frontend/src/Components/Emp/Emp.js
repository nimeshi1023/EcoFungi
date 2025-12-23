import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Emp(props) {
  const {
    _id,
    employee_id,
    name,
    designation,
    email,
    phone_number,
    date_of_joining,
    working_days,
    no_pay_days,
    status,
  } = props.emp;

  const navigate = useNavigate();

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toISOString().split("T")[0];
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/employees/${_id}`);
      alert(`Employee ${employee_id} deleted successfully!`);
      navigate("/employeedetails"); // Refresh page
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee.");
    }
  };

  return (
    <tr className="bg-white border-b border-green-200 hover:bg-[#A5D6A7] transition">
      <td className="px-4 py-2">{employee_id}</td>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{designation}</td>
      <td className="px-4 py-2">{email}</td>
      <td className="px-4 py-2">{phone_number}</td>
      <td className="px-4 py-2">{formatDate(date_of_joining)}</td>
      <td className="px-4 py-2">{working_days}</td>
      <td className="px-4 py-2">{no_pay_days}</td>
      <td className="px-4 py-2">{status}</td>
    </tr>
  );
}

export default Emp;
