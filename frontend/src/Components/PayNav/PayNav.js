import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaPlusCircle, FaListAlt, FaUser, FaInfoCircle,FaTachometerAlt } from "react-icons/fa";

function PayNav() {
  const location = useLocation(); // for active link highlight

  const menuItems = [
     { icon: <FaTachometerAlt />, label: "Dashboard", path: "/finance_manager-dashboard" },
    { icon: <FaUser />, label: "Employees", path: "/employee" },
    { icon: <FaInfoCircle />, label: "Employee Details", path: "/employeedetails" },
    { icon: <FaPlusCircle />, label: "Add Salary", path: "/payroll" },
    { icon: <FaListAlt />, label: "Payment Details", path: "/paymentdetails" },
    
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-52 bg-green-900 text-white flex flex-col py-6">
      {/* Header */}
      <div className="flex items-center px-5 pb-5 border-b border-green-400 font-bold text-lg">
        💰 Payroll
      </div>

      {/* Menu */}
      <ul className="flex flex-col mt-6">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`flex items-center px-5 py-3 cursor-pointer transition-colors duration-200
              ${location.pathname === item.path ? 'bg-green-700 font-bold border-l-4 border-white' : 'hover:bg-green-600'}`}
          >
            <div className="mr-3">{item.icon}</div>
            <Link to={item.path} className="flex-1">{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PayNav;
