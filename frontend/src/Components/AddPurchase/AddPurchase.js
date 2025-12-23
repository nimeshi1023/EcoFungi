import React, { useState, useEffect } from "react";
import PurchaseNav from "../PurchaseNav/PurchaseNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddPurchase() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    Purchase_id: "",
    Supplier_id: "",
    Item_name: "",
    Purchase_date: "",
    Price: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // ✅ Fetch supplier list
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/suppliers");
        if (Array.isArray(res.data.suppliers)) {
          setSuppliers(res.data.suppliers);
        } else {
          console.error("Suppliers data is not an array", res.data);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // ✅ Field-level validation
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
        else if (new Date(value) > new Date())
          error = "Purchase date cannot be in the future.";
        break;

      case "Price":
        if (value === "") error = "Price is required.";
        else {
          const priceRegex = /^\d+(\.\d{1,2})?$/;
          if (!priceRegex.test(value))
            error = "Price must be a valid number (max 2 decimals).";
          else if (Number(value) <= 0)
            error = "Price must be greater than 0.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // ✅ Handle input change (real-time validation)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Live validation only after user touched the field
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // ✅ Handle blur to mark field as touched and validate
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // ✅ Validate full form before submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      const error = validateField(key, inputs[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors([]);

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/purchases", {
        Supplier_id: inputs.Supplier_id,
        Item_name: inputs.Item_name,
        Purchase_date: new Date(inputs.Purchase_date),
        Price: Number(inputs.Price),
      });

      const codeNumber = res.data.Purchase_id;
      const formattedCode = "ITEM" + String(codeNumber).padStart(3, "0");
      setInputs((prev) => ({ ...prev, Purchase_id: formattedCode }));

      alert("✅ Purchase Added Successfully!");
      navigate("/purchasedetails");
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
      } else {
        console.error("Error adding purchase:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PurchaseNav />

      <div className="flex-grow flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Add Purchase
          </h1>

          {/* Server Errors */}
          {serverErrors.length > 0 && (
            <div className="mb-4 text-red-600">
              <ul className="list-disc ml-5">
                {serverErrors.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Purchase ID */}
            <div>
              <label className="block font-medium text-gray-700">
                Purchase ID
              </label>
              <input
                type="text"
                name="Purchase_id"
                value={inputs.Purchase_id || "Auto-generated"}
                readOnly
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block font-medium text-gray-700">Supplier</label>
              <select
                name="Supplier_id"
                value={inputs.Supplier_id}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Supplier_id
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
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
              <label className="block font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                name="Item_name"
                value={inputs.Item_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Item_name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Item_name && errors.Item_name && (
                <p className="text-red-500 text-sm mt-1">{errors.Item_name}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block font-medium text-gray-700">
                Purchase Date
              </label>
              <input
                type="date"
                name="Purchase_date"
                value={inputs.Purchase_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Purchase_date
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Purchase_date && errors.Purchase_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Purchase_date}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="Price"
                value={inputs.Price}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                className={`mt-1 block w-full px-4 py-2 border rounded ${
                  errors.Price
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Price && errors.Price && (
                <p className="text-red-500 text-sm mt-1">{errors.Price}</p>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="mt-4 w-full px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
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

export default AddPurchase;
