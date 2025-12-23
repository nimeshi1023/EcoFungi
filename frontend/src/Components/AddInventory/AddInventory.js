import React, { useState, useEffect } from 'react';
import InventoryNav from "../InventoryNav/InventoryNav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddInventory() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    Item_code: "",
    Category: "",
    Item_name: "",
    Quantity: "",
    Unit: "",
    Received_date: "",
    Expired_date: "",
    Reorder_level: "",
    Description: "",
    Purchase_id: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [purchases, setPurchases] = useState([]);

  // Fetch purchases for dropdown
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/purchases");
        if (Array.isArray(res.data.purchases)) {
          setPurchases(res.data.purchases);
        }
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
        if (value === "") error = "Quantity is required.";
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
        if (value && inputs.Received_date && new Date(value) < new Date(inputs.Received_date)) {
          error = "Expired date cannot be before received date.";
        }
        break;

      case "Reorder_level":
        if (value === "") error = "Reorder level is required.";
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

    // Validate only if field is touched
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/items", {
        Category: String(inputs.Category),
        Item_name: String(inputs.Item_name),
        Quantity: Number(inputs.Quantity),
        Unit: String(inputs.Unit),
        Received_date: new Date(inputs.Received_date),
        Expired_date: inputs.Expired_date ? new Date(inputs.Expired_date) : null,
        Reorder_level: Number(inputs.Reorder_level),
        Description: String(inputs.Description),
        Purchase_id: String(inputs.Purchase_id),
      });

      const codeNumber = res.data.Item_code;
      const formattedCode = "ITEM" + String(codeNumber).padStart(3, "0");
      setInputs((prev) => ({ ...prev, Item_code: formattedCode }));

      alert("✅ Item added successfully!");
      navigate("/itemdetails");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("❌ Failed to add item. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InventoryNav />
      <div className="flex-grow flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Add Inventory Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Item Code */}
            <div>
              <label className="block font-medium text-gray-700">Item Code</label>
              <input
                type="text"
                name="Item_code"
                value={inputs.Item_code || "Auto-generated"}
                readOnly
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-gray-700">Category</label>
              <select
                name="Category"
                value={inputs.Category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Category ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              >
                <option value="">-- Select Category --</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Spores/Spawn">Spores/Spawn</option>
                <option value="Packaging">Packaging</option>
                <option value="Others">Others</option>
              </select>
              {touched.Category && errors.Category && (
                <p className="text-red-500 text-sm mt-1">{errors.Category}</p>
              )}
            </div>

            {/* Item Name */}
            <div>
              <label className="block font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="Item_name"
                value={inputs.Item_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Item_name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Item_name && errors.Item_name && (
                <p className="text-red-500 text-sm mt-1">{errors.Item_name}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="Quantity"
                value={inputs.Quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Quantity ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Quantity && errors.Quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.Quantity}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <label className="block font-medium text-gray-700">Unit</label>
              <input
                type="text"
                name="Unit"
                value={inputs.Unit}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Unit ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Unit && errors.Unit && (
                <p className="text-red-500 text-sm mt-1">{errors.Unit}</p>
              )}
            </div>

            {/* Received Date */}
            <div>
              <label className="block font-medium text-gray-700">Received Date</label>
              <input
                type="date"
                name="Received_date"
                value={inputs.Received_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Received_date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Received_date && errors.Received_date && (
                <p className="text-red-500 text-sm mt-1">{errors.Received_date}</p>
              )}
            </div>

            {/* Expired Date */}
            <div>
              <label className="block font-medium text-gray-700">Expired Date</label>
              <input
                type="date"
                name="Expired_date"
                value={inputs.Expired_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Expired_date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Expired_date && errors.Expired_date && (
                <p className="text-red-500 text-sm mt-1">{errors.Expired_date}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block font-medium text-gray-700">Reorder Level</label>
              <input
                type="number"
                name="Reorder_level"
                value={inputs.Reorder_level}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Reorder_level ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Reorder_level && errors.Reorder_level && (
                <p className="text-red-500 text-sm mt-1">{errors.Reorder_level}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                name="Description"
                value={inputs.Description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Purchase ID */}
            <div>
              <label className="block font-medium text-gray-700">Purchase ID</label>
              <select
                name="Purchase_id"
                value={inputs.Purchase_id}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Purchase_id ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              >
                <option value="">Select Purchase ID</option>
                {Array.isArray(purchases) &&
                  purchases.map((purchase) => (
                    <option key={purchase.Purchase_id} value={purchase.Purchase_id}>
                      {purchase.Purchase_id}
                    </option>
                  ))}
              </select>
              {touched.Purchase_id && errors.Purchase_id && (
                <p className="text-red-500 text-sm mt-1">{errors.Purchase_id}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
