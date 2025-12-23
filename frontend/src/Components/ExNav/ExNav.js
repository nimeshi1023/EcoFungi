import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaPlusCircle, FaListAlt,  FaMoneyBillWave,FaTachometerAlt } from "react-icons/fa";

function ExNav() {
  const location = useLocation(); // to highlight active link

  const menuItems = [
     { icon: <FaTachometerAlt />, label: "Dashboard", path: "/finance_manager-dashboard" },
    { icon: <FaPlusCircle />, label: "Add Expenses", path: "/expense" },
    { icon: <FaListAlt />, label: "Expenses Details", path: "/exdetails" },
    
    
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-52 bg-green-900 text-white flex flex-col py-6">
      {/* Header */}
      <div className="flex items-center px-5 pb-5 border-b border-green-400 font-bold text-lg">
        <FaMoneyBillWave className="mr-2 text-green-400" /> Expenses
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

export default ExNav;
