import React from 'react';
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaCartPlus, FaShoppingBag, FaFileAlt } from "react-icons/fa";

function PurchaseNav() {
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
          <FaCartPlus />
          <Link to="/addpurchase" className="no-underline text-inherit w-full flex items-center">
            Add Purchase Item
          </Link>
        </li>
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaShoppingBag />
          <Link to="/purchasedetails" className="no-underline text-inherit w-full flex items-center">
            Purchase Details
          </Link>
        </li>
        <li className="flex items-center px-5 py-3 hover:bg-green-600 transition gap-2">
          <FaFileAlt />
          <Link to="/purchreports" className="no-underline text-inherit w-full flex items-center">
            Purchase Report
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default PurchaseNav;
