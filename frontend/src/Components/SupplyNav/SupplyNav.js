import React from 'react';
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserPlus, FaUsers, FaFileAlt } from "react-icons/fa";

function SupplyNav() {
  return (
    <div className="w-52 bg-green-900 text-white h-screen fixed py-5">
      <div className="text-lg font-bold px-5 pb-5 border-b border-green-300 flex items-center gap-2">
        🍄 EcoFungi
      </div>

      <ul className="list-none p-0 m-0">
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaTachometerAlt />
          <Link to="/Inventory_Manager-dashboard" className="no-underline text-inherit w-full flex items-center">
            Dashboard
          </Link>
        </li>
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaUserPlus />
          <Link to="/addsupplier" className="no-underline text-inherit w-full flex items-center">
            Add Supplier Details
          </Link>
        </li>
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaUsers />
          <Link to="/supplierdetails" className="no-underline text-inherit w-full flex items-center">
            Supplier Details
          </Link>
        </li>
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaFileAlt />
          <Link to="/supreports" className="no-underline text-inherit w-full flex items-center">
            Supplier Report
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SupplyNav;
