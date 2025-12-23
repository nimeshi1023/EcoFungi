import React, { useState, useEffect } from "react";
import axios from "axios";
import BatchNav from "../BatchNav/BatchNav";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";

function BagForm() {
  const [bagName, setBagName] = useState("");
  const [items, setItems] = useState([{ inventoryId: "", quantity: "" }]);
  const [inventory, setInventory] = useState([]);
  const [bags, setBags] = useState([]);
  const navigate = useNavigate();

  // Fetch inventory and bags from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/items");
        if (res.data && Array.isArray(res.data.items)) {
          setInventory(res.data.items);
        } else {
          setInventory([]);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setInventory([]);
      }
    };

    const fetchBags = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bags");
        if (Array.isArray(res.data)) {
          setBags(res.data);
        } else {
          setBags([]);
        }
      } catch (err) {
        console.error("Error fetching bags:", err);
        setBags([]);
      }
    };

    fetchInventory();
    fetchBags();
  }, []);

  // Handle change in inventory selection or quantity
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { inventoryId: "", quantity: "" }]);
  };

  // Remove item row
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit bag to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { bagName, items };
      await axios.post("http://localhost:5000/bags", payload);
      alert("Bag saved successfully!");
      setBagName("");
      setItems([{ inventoryId: "", quantity: "" }]);

      // Refresh bag list
      const res = await axios.get("http://localhost:5000/bags");
      setBags(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error saving bag:", err);
      alert("Failed to save bag");
    }
  };

  // Delete bag
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bag?")) return;
    try {
      await axios.delete(`http://localhost:5000/bags/${id}`);
      setBags(bags.filter((bag) => bag._id !== id));
    } catch (err) {
      console.error("Error deleting bag:", err);
      alert("Failed to delete bag");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixed on left */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-40">
        <BatchNav />
      </div>

      {/* Header fixed on top, only over main content */}
      <div className="fixed top-0 left-64 right-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-20 p-6">
        {/* Form Section */}
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create Mushroom Bag</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bag Name */}
          <div>
            <label className="block font-medium mb-2">Bag Name</label>
            <input
              type="text"
              value={bagName}
              onChange={(e) => setBagName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Bag Items */}
          <div>
            <label className="block font-medium mb-2">Items</label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-3 items-center">
                {/* Inventory Dropdown */}
                <select
                  value={item.inventoryId}
                  onChange={(e) =>
                    handleItemChange(index, "inventoryId", e.target.value)
                  }
                  className="flex-1 border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Item</option>
                  {inventory.map((inv) => (
                    <option key={inv._id} value={inv._id}>
                      {inv.Item_name}
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="w-32 border rounded-lg px-3 py-2"
                  min="1"
                  required
                />

                {/* Remove Button */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              + Add Item
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Save Bag
          </button>
        </form>
        </div>

        {/* Bag List Section */}
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-4">
        <h3 className="text-xl font-bold mb-4">Available Bags</h3>
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 border">Bag Name</th>
              <th className="px-4 py-2 border">Items Count</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bags.length > 0 ? (
              bags.map((bag) => (
                <tr key={bag._id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/update-bag/${bag._id}`}
                      className="text-blue-600 underline hover:text-blue-800 font-medium"
                    >
                      {bag.bagName}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border">
                    {bag.items ? bag.items.length : 0}
                  </td>
                  <td className="px-4 py-2 border flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/update-bag/${bag._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(bag._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No bags available
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

export default BagForm;
