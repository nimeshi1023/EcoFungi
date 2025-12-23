import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddCustomer() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    ShopName: "",
    OwnerName: "",
    Email: "",
    PhoneNo: "",
    City: "",
    Status: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const validate = () => {
    const newErrors = {};

    // Shop Name: letters and spaces only, at least 2 words
    if (!inputs.ShopName) {
      newErrors.ShopName = "Shop Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.ShopName)) {
      newErrors.ShopName = "Shop Name can only contain letters and spaces.";
    } else if (inputs.ShopName.trim().split(/\s+/).length < 2) {
      newErrors.ShopName = "Shop Name must contain at least 2 words.";
    }

    // Owner Name: letters and spaces only, at least 2 words
    if (!inputs.OwnerName) {
      newErrors.OwnerName = "Owner Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.OwnerName)) {
      newErrors.OwnerName = "Owner Name can only contain letters and spaces.";
    } else if (inputs.OwnerName.trim().split(/\s+/).length < 2) {
      newErrors.OwnerName = "Owner Name must contain at least 2 words.";
    }

    // Email: must include @ and .com
    if (!inputs.Email) {
      newErrors.Email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputs.Email)) {
      newErrors.Email = "Invalid email format (must include @ and .com).";
    }

    // Phone Number: start with 07, 10 digits
    if (!inputs.PhoneNo) {
      newErrors.PhoneNo = "Phone number is required.";
    } else if (!/^07\d{8}$/.test(inputs.PhoneNo)) {
      newErrors.PhoneNo = "Phone number must start with 07 and be exactly 10 digits.";
    }

    if (!inputs.City) newErrors.City = "Address is required.";
    if (!inputs.Status) newErrors.Status = "Status must be selected.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/Customer", inputs);
      navigate("/Customer");
    } catch (err) {
      console.error("Failed to add customer:", err);
      alert("Failed to add customer. Please try again.");
    }
  };

  const handleReset = () => {
    setInputs({
      ShopName: "",
      OwnerName: "",
      Email: "",
      PhoneNo: "",
      City: "",
      Status: "",
    });
    setErrors({});
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Add New Customer
        </h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Shop Name
          </label>
          <input
            type="text"
            name="ShopName"
            value={inputs.ShopName}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.ShopName ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.ShopName && (
            <span className="text-red-600 text-sm mt-1">{errors.ShopName}</span>
          )}
        </div>

        {/* Owner Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Owner Name
          </label>
          <input
            type="text"
            name="OwnerName"
            value={inputs.OwnerName}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.OwnerName ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.OwnerName && (
            <span className="text-red-600 text-sm mt-1">{errors.OwnerName}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Email
          </label>
          <input
            type="email"
            name="Email"
            value={inputs.Email}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.Email ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.Email && (
            <span className="text-red-600 text-sm mt-1">{errors.Email}</span>
          )}
        </div>

        {/* Phone No */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Phone No
          </label>
          <input
            type="tel"
            name="PhoneNo"
            placeholder="07XXXXXXXX"
            value={inputs.PhoneNo}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                handleChange({ target: { name: "PhoneNo", value } });
              }
            }}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.PhoneNo ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.PhoneNo && (
            <span className="text-red-600 text-sm mt-1">{errors.PhoneNo}</span>
          )}
        </div>

        {/* City */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Address
          </label>
          <input
            type="text"
            name="City"
            value={inputs.City}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.City ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.City && (
            <span className="text-red-600 text-sm mt-1">{errors.City}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Status
          </label>
          <select
            name="Status"
            value={inputs.Status}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.Status ? "border-red-500" : "focus:ring-green-400"
            }`}
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.Status && (
            <span className="text-red-600 text-sm mt-1">{errors.Status}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;
