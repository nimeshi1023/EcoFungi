import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTruck, 
  FaShoppingCart, 
  FaSignOutAlt 
} from "react-icons/fa";

function MainIntNavNav() {
  const location = useLocation(); // for active link highlight

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/Inventory_Manager-dashboard" },
    { icon: <FaBoxOpen />, label: "Inventory Item", path: "/itemdetails" },
    { icon: <FaTruck />, label: "Supplier", path: "/supplierdetails" },
    { icon: <FaShoppingCart />, label: "Purchases", path: "/purchasedetails" },
    
    { icon: <FaSignOutAlt />, label: "Logout", path: "/logout" },
  ];

  return (
    <div className="w-52 bg-green-800 text-white fixed top-0 left-0 h-screen flex flex-col">
      {/* Header */}
      <div className="text-2xl font-bold text-center py-6 border-b border-green-700">
        🍄 EcoFungi
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <li 
            key={item.label} 
            className={`flex items-center rounded transition-colors
              ${location.pathname === item.path ? 'bg-green-700 font-bold' : 'hover:bg-green-600'}`}
          >
            {/* Icon */}
            <span className="px-4">{item.icon}</span>

            {/* Label */}
            {item.path === "/logout" ? (
              <span className="py-3 flex-1">{item.label}</span>
            ) : (
              <Link to={item.path} className="py-3 flex-1 block">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainIntNavNav;
