import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BatchNav from "../BatchNav/BatchNav";
import Header from "../Header/Header";

function UpdateBag() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bagName, setBagName] = useState("");
  const [items, setItems] = useState([{ inventoryId: "", quantity: "" }]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch inventory and current bag data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory
        const inventoryRes = await axios.get("http://localhost:5000/items");
        if (inventoryRes.data && Array.isArray(inventoryRes.data.items)) {
          setInventory(inventoryRes.data.items);
        }

        // Fetch current bag data
        const bagRes = await axios.get("http://localhost:5000/bags");
        if (Array.isArray(bagRes.data)) {
          const currentBag = bagRes.data.find(bag => bag._id === id);
          if (currentBag) {
            setBagName(currentBag.bagName || "");
            setItems(currentBag.items && currentBag.items.length > 0 
              ? currentBag.items.map(item => ({
                  inventoryId: item.inventoryId._id || item.inventoryId,
                  quantity: item.quantity || ""
                }))
              : [{ inventoryId: "", quantity: "" }]
            );
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load bag data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update bag
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { bagName, items };
      await axios.put(`http://localhost:5000/bags/${id}`, payload);
      alert("Bag updated successfully!");
      navigate("/addbag");
    } catch (err) {
      console.error("Error updating bag:", err);
      alert("Failed to update bag");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bag data...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Update Mushroom Bag</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bag Name */}
            <div>
              <label className="block font-medium mb-2">Bag Name</label>
              <input
                type="text"
                value={bagName}
                onChange={(e) => setBagName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                    className="w-32 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    min="1"
                    required
                  />

                  {/* Remove Button */}
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                + Add Item
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Update Bag
              </button>
              <button
                type="button"
                onClick={() => navigate("/addbag")}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBag;
