import React from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/mainhome" },
    { name: "Add Batch", path: "/addbatch" },
    { name: "Batch Details", path: "/batchdetails" },
     { name: "Mushroom Pot", path: "/addbag" },
    //{ name: "Send PDF", path: "/sendpdf" },
  ];

  return (
    <div>
      
    <div className="h-screen w-64 bg-green-900 text-white flex flex-col shadow-lg fixed left-0 top-0">
     
      {/* Brand / Logo */}
      <div className="px-6 py-4 text-2xl font-bold border-b border-green-700">
        Dashboard
      </div>

      {/* Menu */}
      <ul className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition duration-200
                ${
                  location.pathname === item.path
                    ? "bg-green-700 font-semibold"
                    : "hover:bg-green-800"
                }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Nav;
