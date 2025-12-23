import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import InventoryNav from "../InventoryNav/InventoryNav";

function UpdateInventory() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [purchases, setPurchases] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/items/${id}`);
        if (res.data && res.data.items) setInputs(res.data.items);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };
    fetchItem();
  }, [id]);

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/purchases");
        if (Array.isArray(res.data.purchases)) setPurchases(res.data.purchases);
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };
    fetchPurchases();
  }, []);

  // Field-level validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "Category":
        if (!value) error = "Category is required.";
        break;
      case "Item_name":
    if (!value?.trim()) {
        error = "Item name is required.";
    } else if (value.length < 2) {
        error = "Item name must be at least 2 characters.";
    } else if (/\d/.test(value)) {  // Check if value contains any number
        error = "Item name cannot contain numbers.";
    }
    break;

      case "Quantity":
        if (value === "" || value === undefined) error = "Quantity is required.";
        else if (Number(value) < 0) error = "Quantity cannot be negative.";
        else if (Number(value) > 100) error = "Quantity cannot exceed 100.";
        break;
      case "Unit":
        if (!value?.trim()) error = "Unit is required.";
        break;
      case "Received_date":
        if (!value) error = "Received date is required.";
        else if (new Date(value) > new Date()) error = "Received date cannot be in the future.";
        break;
      case "Expired_date":
        if (value && inputs.Received_date && new Date(value) < new Date(inputs.Received_date))
          error = "Expired date cannot be before received date.";
        break;
      case "Reorder_level":
        if (value === "" || value === undefined) error = "Reorder level is required.";
        else if (Number(value) < 0) error = "Reorder level cannot be negative.";
        break;
      case "Purchase_id":
        if (!value) error = "Purchase ID is required.";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input change (real-time validation)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate all fields before submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      const error = validateField(key, inputs[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit update request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/items/${id}`, {
        ...inputs,
        Quantity: Number(inputs.Quantity),
        Reorder_level: Number(inputs.Reorder_level),
      });
      alert("✅ Inventory item updated successfully!");
      navigate("/itemdetails");
    } catch (err) {
      console.error("Error updating item:", err);
      alert("❌ Failed to update item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InventoryNav />
      <div className="flex-1 flex justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Inventory Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Item Code</label>
              <input
                type="text"
                name="Item_code"
                value={inputs.Item_code || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                name="Category"
                value={inputs.Category || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Category ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              >
                <option value="">-- Select Category --</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Spores/Spawn">Spores/Spawn</option>
                <option value="Packaging">Packaging</option>
                <option value="Others">Others</option>
              </select>
              {touched.Category && errors.Category && <p className="text-red-500 text-sm">{errors.Category}</p>}
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Item Name</label>
              <input
                type="text"
                name="Item_name"
                value={inputs.Item_name || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Item_name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Item_name && errors.Item_name && <p className="text-red-500 text-sm">{errors.Item_name}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="Quantity"
                value={inputs.Quantity || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Quantity ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Quantity && errors.Quantity && <p className="text-red-500 text-sm">{errors.Quantity}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Unit</label>
              <input
                type="text"
                name="Unit"
                value={inputs.Unit || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Unit ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Unit && errors.Unit && <p className="text-red-500 text-sm">{errors.Unit}</p>}
            </div>

            {/* Received Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Received Date</label>
              <input
                type="date"
                name="Received_date"
                value={inputs.Received_date ? inputs.Received_date.slice(0, 10) : ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Received_date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Received_date && errors.Received_date && <p className="text-red-500 text-sm">{errors.Received_date}</p>}
            </div>

            {/* Expired Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Expired Date</label>
              <input
                type="date"
                name="Expired_date"
                value={inputs.Expired_date ? inputs.Expired_date.slice(0, 10) : ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Expired_date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Expired_date && errors.Expired_date && <p className="text-red-500 text-sm">{errors.Expired_date}</p>}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Reorder Level</label>
              <input
                type="number"
                name="Reorder_level"
                value={inputs.Reorder_level || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Reorder_level ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Reorder_level && errors.Reorder_level && <p className="text-red-500 text-sm">{errors.Reorder_level}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="Description"
                value={inputs.Description || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 border-gray-300 focus:ring-indigo-400"
              />
            </div>

            {/* Purchase ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Purchase ID</label>
              <select
                name="Purchase_id"
                value={inputs.Purchase_id || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Purchase_id ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              >
                <option value="">Select Purchase ID</option>
                {purchases.map((purchase) => (
                  <option key={purchase.Purchase_id} value={purchase.Purchase_id}>
                    {purchase.Purchase_id}
                  </option>
                ))}
              </select>
              {touched.Purchase_id && errors.Purchase_id && <p className="text-red-500 text-sm">{errors.Purchase_id}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateInventory;
