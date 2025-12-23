import React, { useState } from "react";
import SupplyNav from "../SupplyNav/SupplyNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSupplier() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    Supplier_id: "",
    Supplier_name: "",
    Phone_number: "",
    Email: "",
    Address: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // 👈 To track if user has interacted

  // ✅ Validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "Supplier_name":
        if (!value.trim()) error = "Supplier name is required.";
        else if (value.length < 2)
          error = "Supplier name must be at least 2 characters.";
        else if (!/^[A-Za-z\s.]+$/.test(value))
          error = "Supplier name can contain letters, spaces, and dots only.";
        break;

      case "Phone_number":
        if (!value.trim()) error = "Phone number is required.";
        else if (!/^0\d{9}$/.test(value))
          error = "Phone number must start with 0 and be exactly 10 digits.";
        break;

      case "Email":
        if (!value.trim()) error = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value))
          error = "Invalid email format.";
        break;

      case "Address":
        if (!value.trim()) error = "Address is required.";
        else if (value.trim().length < 5)
          error = "Address must be at least 5 characters.";
        break;

      default:
        break;
    }

    return error;
  };

  // ✅ On change (real-time validation)
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone
    if (name === "Phone_number" && !/^\d*$/.test(value)) return;

    setInputs((prev) => ({ ...prev, [name]: value }));

    // Run validation live only if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // ✅ Mark field as touched when user interacts
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ✅ Validate all before submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      const error = validateField(key, inputs[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/suppliers", {
        Supplier_name: inputs.Supplier_name,
        Phone_number: inputs.Phone_number,
        Email: inputs.Email,
        Address: inputs.Address,
      });

      const codeNumber = res.data.Supplier_id;
      const formattedCode = "SUP" + String(codeNumber).padStart(3, "0");
      setInputs((prev) => ({ ...prev, Supplier_id: formattedCode }));

      alert("✅ Supplier added successfully!");
      navigate("/supplierdetails");
    } catch (err) {
      console.error("Error adding supplier:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SupplyNav />

      <div className="flex-grow flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Supplier Details
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Supplier ID */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Supplier ID
              </label>
              <input
                type="text"
                name="Supplier_id"
                value={inputs.Supplier_id || "Auto-generated"}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Supplier Name
              </label>
              <input
                type="text"
                name="Supplier_name"
                value={inputs.Supplier_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Supplier_name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Supplier_name && errors.Supplier_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Supplier_name}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="Phone_number"
                value={inputs.Phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Phone_number
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Phone_number && errors.Phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Phone_number}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <input
                type="text"
                name="Email"
                value={inputs.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Email && errors.Email && (
                <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Address
              </label>
              <textarea
                name="Address"
                value={inputs.Address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.Address
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {touched.Address && errors.Address && (
                <p className="text-red-500 text-sm mt-1">{errors.Address}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSupplier;
