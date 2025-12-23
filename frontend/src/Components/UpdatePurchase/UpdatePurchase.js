import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import PurchaseNav from "../PurchaseNav/PurchaseNav";

function UpdatePurchase() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch current purchase
  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/purchases/${id}`);
        if (res.data && res.data.purchases) {
          const purchase = res.data.purchases;

          const formattedDate = new Date(purchase.Purchase_date)
            .toISOString()
            .split("T")[0];

          setInputs({
            ...purchase,
            Supplier_id: purchase.supplier?._id || purchase.Supplier_id,
            Purchase_date: formattedDate,
            Price: purchase.Price?.toString() || "",
          });
        }
      } catch (err) {
        console.error("Error fetching purchase:", err);
      }
    };
    fetchPurchase();
  }, [id]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/suppliers");
        if (Array.isArray(res.data.suppliers)) setSuppliers(res.data.suppliers);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Field-level validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "Supplier_id":
        if (!value) error = "Supplier is required.";
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

      case "Purchase_date":
        if (!value) error = "Purchase date is required.";
        else if (new Date(value) > new Date()) error = "Purchase date cannot be in the future.";
        break;
      case "Price":
        if (value === "" || value === undefined) error = "Price is required.";
        else {
          const priceRegex = /^\d+(\.\d{1,2})?$/;
          if (!priceRegex.test(value))
            error = "Price must be a valid non-negative number with up to 2 decimal places.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input change with real-time validation
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

  // Validate all fields on submit
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
      await axios.put(`http://localhost:5000/purchases/${id}`, {
        Supplier_id: inputs.Supplier_id,
        Item_name: inputs.Item_name,
        Purchase_date: inputs.Purchase_date,
        Price: Number(inputs.Price),
      });
      alert("✅ Purchase updated successfully!");
      navigate("/purchasedetails");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update purchase. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PurchaseNav />
      <div className="flex-1 flex justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Purchase
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Purchase ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Purchase ID</label>
              <input
                type="text"
                name="Purchase_id"
                value={inputs.Purchase_id || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier</label>
              <select
                name="Supplier_id"
                value={inputs.Supplier_id || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Supplier_id ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup._id} value={sup.Supplier_id}>
                    {sup.Supplier_id} 
                  </option>
                ))}
              </select>
              {touched.Supplier_id && errors.Supplier_id && (
                <p className="text-red-500 text-sm mt-1">{errors.Supplier_id}</p>
              )}
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
              {touched.Item_name && errors.Item_name && (
                <p className="text-red-500 text-sm mt-1">{errors.Item_name}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Purchase Date</label>
              <input
                type="date"
                name="Purchase_date"
                value={inputs.Purchase_date || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Purchase_date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Purchase_date && errors.Purchase_date && (
                <p className="text-red-500 text-sm mt-1">{errors.Purchase_date}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price</label>
              <input
                type="number"
                name="Price"
                value={inputs.Price || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Price ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Price && errors.Price && (
                <p className="text-red-500 text-sm mt-1">{errors.Price}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePurchase;
