import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ProductName: "",
    MushroomType: "",
    UnitPrice: "",
    Status: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Product/${id}`);
        const productData = res.data.product;

        if (!productData) {
          setError("Product data not found");
          setLoading(false);
          return;
        }

        const formattedData = {
          ProductName: productData.ProductName || "",
          MushroomType: productData.MushroomType || "",
          UnitPrice: productData.UnitPrice || "",
          Status: productData.Status || "",
        };

        setInputs(formattedData);
        setOriginalData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "UnitPrice" ? Number(value) : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Reset button handler
  const handleReset = () => {
    if (originalData) {
      setInputs({ ...originalData });
      setErrors({});
    }
  };

  // Validation before submit
  const validate = () => {
    const tempErrors = {};

    // Product Name: letters and spaces only
    if (!inputs.ProductName.trim()) tempErrors.ProductName = "Product Name is required";
    else if (!/^[A-Za-z\s]+$/.test(inputs.ProductName))
      tempErrors.ProductName = "Product Name can only contain letters and spaces";

    // Mushroom Type: letters and spaces only
    if (!inputs.MushroomType.trim()) tempErrors.MushroomType = "Mushroom Type is required";
    else if (!/^[A-Za-z\s]+$/.test(inputs.MushroomType))
      tempErrors.MushroomType = "Mushroom Type can only contain letters and spaces";

    // Unit Price
    if (inputs.UnitPrice === "" || isNaN(inputs.UnitPrice) || inputs.UnitPrice < 0)
      tempErrors.UnitPrice = "Unit Price must be a positive number";

    // Status
    if (!inputs.Status) tempErrors.Status = "Status is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/Product/${id}`, inputs);
      return res.data;
    } catch (err) {
      console.error("Error updating Product:", err);
      setError("Failed to update Product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails
    await sendRequest();
    navigate("/Product");
  };

  if (loading) return <p className="text-gray-600">Loading product data...</p>;
  if (error) return <p className="text-red-500 font-semibold">{error}</p>;
  if (!inputs) return null;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
        Update Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-green-700 font-semibold mb-1">Product Name</label>
          <input
            type="text"
            name="ProductName"
            value={inputs.ProductName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.ProductName ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.ProductName && <p className="text-red-600 text-sm mt-1">{errors.ProductName}</p>}
        </div>

        {/* Mushroom Type */}
        <div>
          <label className="block text-green-700 font-semibold mb-1">Mushroom Type</label>
          <input
            type="text"
            name="MushroomType"
            value={inputs.MushroomType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.MushroomType ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.MushroomType && <p className="text-red-600 text-sm mt-1">{errors.MushroomType}</p>}
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-green-700 font-semibold mb-1">Unit Price</label>
          <input
            type="number"
            name="UnitPrice"
            value={inputs.UnitPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.UnitPrice ? "border-red-500 focus:ring-red-400" : "border-green-200 focus:ring-green-400"
            }`}
          />
          {errors.UnitPrice && <p className="text-red-600 text-sm mt-1">{errors.UnitPrice}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-green-700 font-semibold mb-1">Status</label>
          <select
            name="Status"
            value={inputs.Status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;
