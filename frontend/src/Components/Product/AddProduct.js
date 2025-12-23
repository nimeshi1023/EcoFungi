import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    ProductName: "",
    MushroomType: "",
    UnitPrice: "",
    Status: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    // Product Name: letters and spaces only
    if (!inputs.ProductName.trim()) {
      newErrors.ProductName = "Product Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.ProductName)) {
      newErrors.ProductName = "Product Name can only contain letters and spaces";
    }

    // Mushroom Type: letters and spaces only
    if (!inputs.MushroomType.trim()) {
      newErrors.MushroomType = "Mushroom Type is required";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.MushroomType)) {
      newErrors.MushroomType = "Mushroom Type can only contain letters and spaces";
    }

    // Unit Price
    if (!inputs.UnitPrice) newErrors.UnitPrice = "Unit Price is required";
    else if (Number(inputs.UnitPrice) <= 0) newErrors.UnitPrice = "Unit Price must be positive";

    // Status
    if (!inputs.Status) newErrors.Status = "Please select a status";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/Product", {
        ProductName: inputs.ProductName.trim(),
        MushroomType: inputs.MushroomType.trim(),
        UnitPrice: parseFloat(inputs.UnitPrice).toFixed(2),
        Status: inputs.Status,
      });
      navigate("/Product");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  const handleReset = () => {
    setInputs({ ProductName: "", MushroomType: "", UnitPrice: "", Status: "" });
    setErrors({});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Add New Product
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="ProductName"
            onChange={handleChange}
            value={inputs.ProductName}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.ProductName ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.ProductName && <p className="text-red-600 text-sm mt-1">{errors.ProductName}</p>}
        </div>

        {/* Mushroom Type */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Mushroom Type</label>
          <input
            type="text"
            name="MushroomType"
            onChange={handleChange}
            value={inputs.MushroomType}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.MushroomType ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.MushroomType && <p className="text-red-600 text-sm mt-1">{errors.MushroomType}</p>}
        </div>

        {/* Unit Price */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Unit Price</label>
          <input
            type="number"
            name="UnitPrice"
            onChange={handleChange}
            value={inputs.UnitPrice}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.UnitPrice ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.UnitPrice && <p className="text-red-600 text-sm mt-1">{errors.UnitPrice}</p>}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-green-700 font-semibold mb-2">Status</label>
          <select
            name="Status"
            onChange={handleChange}
            value={inputs.Status}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.Status ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Available</option>
            <option value="Inactive">Unavailable</option>
          </select>
          {errors.Status && <p className="text-red-600 text-sm mt-1">{errors.Status}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white font-bold py-2 rounded-lg shadow hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="flex-1 bg-gray-100 text-green-800 border border-green-200 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
