import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InventoryNav from "../InventoryNav/InventoryNav";
import axios from "axios";
import ItemDetails from "../ItemDetails/ItemDetails";

const URL = "http://localhost:5000/items";

// Fetch items from backend
const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching items:", err);
    return { items: [] };
  }
};

function Items() {
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const getItems = async () => {
      const data = await fetchHandler();
      if (!data?.items) return;

      setItems(data.items);
      setOriginalItems(data.items);

      // Alert for low stock
      const lowStockItems = data.items.filter(
        (item) => item.Quantity < item.Reorder_level
      );
      if (lowStockItems.length > 0) {
        const message = lowStockItems
          .map(
            (i) =>
              `${i.Item_name} (Qty: ${i.Quantity}, Reorder: ${i.Reorder_level})`
          )
          .join("\n");
        alert(`⚠ The following items are below reorder level:\n${message}`);
      }
    };

    getItems();
  }, []);

  // Search by Item Code
useEffect(() => {
  const trimmed = searchQuery.trim().toLowerCase();

  if (trimmed === "") {
    setItems(originalItems);
    setNoResults(false);
  } else {
    const filtered = originalItems.filter(
      (item) =>
        item.Item_code?.toString().toLowerCase().startsWith(trimmed) ||
        item.Item_name?.toString().toLowerCase().startsWith(trimmed)
    );

    setItems(filtered);
    setNoResults(filtered.length === 0);
  }
}, [searchQuery, originalItems]);



  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    setOriginalItems((prev) => prev.filter((item) => item._id !== id));
  };

  const categories = ["All", ...new Set(originalItems.map((item) => item.Category))];
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.Category === selectedCategory);

  const lowStockItems = filteredItems.filter(
    (item) => item.Quantity < item.Reorder_level
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-52 fixed top-0 left-0 h-screen">
        <InventoryNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-52 p-6 overflow-y-auto">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md rounded-2xl p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Inventory Item Details
          </h1>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="bg-white shadow rounded-xl px-4 py-2 text-center">
              <p className="text-gray-500 text-sm font-semibold">TOTAL ITEMS</p>
              <p className="text-2xl font-bold text-gray-800">{items.length}</p>
            </div>
            <div className="bg-red-100 shadow rounded-xl px-4 py-2 text-center">
              <p className="text-red-600 text-sm font-semibold">ROL ITEMS</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔎 Search by Item Code or Item name..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          {noResults ? (
            <p className="text-center text-red-500 font-semibold">
              ❌ No matching items found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Item Code</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Item Name</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Unit</th>
                    <th className="px-4 py-3 text-left">Received Date</th>
                    <th className="px-4 py-3 text-left">Expired Date</th>
                    <th className="px-4 py-3 text-left">Reorder Level</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Purchase ID</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, i) => (
                    <ItemDetails key={i} item={item} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Section */}
        {lowStockItems.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
              ⚠ Low Stock Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-red-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Item Code</th>
                    <th className="px-4 py-2 text-left">Item Name</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Reorder Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{item.Item_code}</td>
                      <td className="px-4 py-2">{item.Item_name}</td>
                      <td className="px-4 py-2 text-red-600 font-bold">
                        {item.Quantity}
                      </td>
                      <td className="px-4 py-2">{item.Reorder_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;
