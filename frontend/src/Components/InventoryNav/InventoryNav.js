import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUserPlus, FaUsers, FaFileAlt } from "react-icons/fa";
function InventoryNav() {
  const location = useLocation();

  // Active link style
  const isActive = (path) =>
    location.pathname === path ? "bg-green-600" : "hover:bg-green-600";

  return (
    <div className="w-52 bg-green-800 text-white h-screen fixed flex flex-col">
      {/* Header */}
      <div className="text-2xl font-bold text-center py-6 border-b border-green-700">
        🍄 EcoFungi
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-4 space-y-2 px-1">
        <li>
          <Link
            to="/Inventory_Manager-dashboard"
            className={`flex items-center gap-3 px-6 py-3 rounded transition-colors ${isActive(
              "/Inventory_Manager-dashboard"
            )}`}
          >
            <FaTachometerAlt />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/additem"
            className={`flex items-center gap-3 px-6 py-3 rounded transition-colors ${isActive(
              "/additem"
            )}`}
          >
            <FaUserPlus />
            Add Item
          </Link>
        </li>

        <li>
          <Link
            to="/itemdetails"
            className={`flex items-center gap-3 px-6 py-3 rounded transition-colors ${isActive(
              "/itemdetails"
            )}`}
          >
            <FaUsers />
            Inventory Details
          </Link>
        </li>

        <li>
          <Link
            to="/intreports"
            className={`flex items-center gap-3 px-6 py-3 rounded transition-colors ${isActive(
              "/intreports"
            )}`}
          >
            <FaFileAlt />
            Inventory Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default InventoryNav;
