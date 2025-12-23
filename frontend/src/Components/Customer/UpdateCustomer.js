import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ShopName: "",
    OwnerName: "",
    Email: "",
    PhoneNo: "",
    City: "",
    Status: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Customer/${id}`);
        const customerData = res.data.customer;

        if (!customerData) {
          setError("Customer data not found");
          setLoading(false);
          return;
        }
        setInputs(customerData);
        setOriginalData(customerData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Customer:", err);
        setError("Failed to load Customer data");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleReset = () => {
    if (originalData) setInputs(originalData);
    setErrors({});
  };

  // ✅ Validation Function
  const validate = () => {
    const newErrors = {};

    // Shop Name - letters and spaces only, at least 2 words
    if (!inputs.ShopName) {
      newErrors.ShopName = "Shop Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.ShopName)) {
      newErrors.ShopName = "Shop Name can only contain letters and spaces.";
    } else if (inputs.ShopName.trim().split(/\s+/).length < 2) {
      newErrors.ShopName = "Shop Name must contain at least 2 words.";
    }

    // Owner Name - letters and spaces only, at least 2 words
    if (!inputs.OwnerName) {
      newErrors.OwnerName = "Owner Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.OwnerName)) {
      newErrors.OwnerName = "Owner Name can only contain letters and spaces.";
    } else if (inputs.OwnerName.trim().split(/\s+/).length < 2) {
      newErrors.OwnerName = "Owner Name must contain at least 2 words.";
    }

    // Email - must include @ and .com
    if (!inputs.Email) {
      newErrors.Email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputs.Email)) {
      newErrors.Email = "Invalid email format (must include @ and .com).";
    }

    // Phone validation - Sri Lankan style
    if (!inputs.PhoneNo) {
      newErrors.PhoneNo = "Phone number is required.";
    } else if (!/^07\d{8}$/.test(inputs.PhoneNo)) {
      newErrors.PhoneNo =
        "Phone number must be 10 digits and start with 07 (e.g., 0712345678).";
    }

    // Address validation
    if (!inputs.City) {
      newErrors.City = "Address is required.";
    }

    // Status validation
    if (!inputs.Status) {
      newErrors.Status = "Status must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/Customer/${id}`,
        inputs
      );
      return res.data;
    } catch (err) {
      console.error("Error updating Customer:", err);
      setError("Failed to update Customer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await sendRequest();
    navigate("/Customer");
  };

  if (loading) return <p>Loading Customer data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!inputs) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Update Customer Details
        </h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Shop Name
          </label>
          <input
            type="text"
            name="ShopName"
            onChange={handleChange}
            value={inputs.ShopName}
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
            onChange={handleChange}
            value={inputs.OwnerName}
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
            onChange={handleChange}
            value={inputs.Email}
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
            maxLength={10}
            onChange={handleChange}
            value={inputs.PhoneNo}
            placeholder="07XXXXXXXX"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.PhoneNo ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.PhoneNo && (
            <span className="text-red-600 text-sm mt-1">{errors.PhoneNo}</span>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Address
          </label>
          <input
            type="text"
            name="City"
            onChange={handleChange}
            value={inputs.City}
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
            onChange={handleChange}
            value={inputs.Status}
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

export default UpdateCustomer;
