import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaMoneyBillWave, FaUsers, FaBoxOpen, FaClipboardList, FaShoppingCart  } from "react-icons/fa";

function Nav() {
  const location = useLocation(); // to highlight active link

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/Dash" },
    { icon: <FaMoneyBillWave />, label: "Sales", path: "/Sales" },
    { icon: <FaUsers />, label: "Customer Details", path: "/Customer" },
    { icon: <FaBoxOpen />, label: "Product Details", path: "/Product" },
    { icon: <FaClipboardList />, label: "Mushroom Packets Stock", path: "/Stock" },
    { icon: <FaShoppingCart  />, label: "Orders", path: "/Order" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-green-900 text-white flex flex-col py-6">
      {/* Header */}
      <div className="flex items-center px-5 pb-5 border-b border-green-400 font-bold text-xl">
        🍄 EchoFungi
      </div>

      {/* Menu */}
      <ul className="flex flex-col mt-6">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`flex items-center px-5 py-3 cursor-pointer transition-colors duration-200
              ${location.pathname === item.path ? 'bg-green-700 font-bold border-l-4 border-white' : 'hover:bg-green-600'}`}
          >
            <div className="mr-3 text-lg">{item.icon}</div>
            <Link to={item.path} className="flex-1">{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Nav;
