import React, { useEffect, useRef, useState } from "react";
import SupplyNav from "../SupplyNav/SupplyNav";
import axios from "axios";
import SupplyDetails from "../SupplyDetails/SupplyDetails";
import { useNavigate } from "react-router-dom";
import { FaTruck } from "react-icons/fa";

const URL = "http://localhost:5000/suppliers";

function Supplies() {
  const [suppliers, setSuppliers] = useState([]);
  const [originalSuppliers, setOriginalSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();
  const tableRef = useRef();

  // Fetch suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data;
        const suppliersArray = data.suppliers || data || [];
        setSuppliers(suppliersArray);
        setOriginalSuppliers(suppliersArray);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Auto-search when typing
  useEffect(() => {
  const trimmedQuery = searchQuery.trim().toLowerCase();

  if (trimmedQuery === "") {
    setSuppliers(originalSuppliers);
    setNoResults(false);
  } else {
    const filtered = originalSuppliers.filter(
      (supplier) =>
        supplier.Supplier_id?.toString().toLowerCase().startsWith(trimmedQuery) ||
        supplier.Supplier_name?.toLowerCase().startsWith(trimmedQuery)
    );

    setSuppliers(filtered);
    setNoResults(filtered.length === 0);
  }
}, [searchQuery, originalSuppliers]);


  // Delete supplier
  const handleDelete = (id) => {
    setSuppliers((prev) => prev.filter((s) => s._id !== id));
    setOriginalSuppliers((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <SupplyNav />
      </div>

      {/* Main content */}
      <div className="ml-[200px] p-6 w-full">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md rounded-2xl p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaTruck className="text-green-700" /> Suppliers Details
          </h1>
          <div className="bg-white shadow rounded-xl px-4 py-2 text-center mt-4 md:mt-0">
            <p className="text-gray-500 text-sm font-semibold">TOTAL SUPPLIERS</p>
            <p className="text-2xl font-bold text-gray-800">{suppliers.length}</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-center">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="🔎 Search by Supplier ID or Supplier Name..."
    className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
  />
</div>


        {/* Show message if no results */}
        {noResults && (
          <p className="text-red-500 font-bold mb-4 text-center">
            ❌ No suppliers found
          </p>
        )}

        {/* Table with supplier details */}
        <div
          ref={tableRef}
          className="overflow-x-auto bg-white rounded-xl shadow-lg border"
        >
          <table className="w-full border-collapse">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Supplier ID
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Supplier Name
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Address
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((s) => (
                  <SupplyDetails key={s._id} supplier={s} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Supplies;
