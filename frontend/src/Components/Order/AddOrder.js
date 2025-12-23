import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inputs, setInputs] = useState({
    ShopName: "",
    ProductId: "",
    OrderDate: "",
    Quantity: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers")
      .then((res) => setCustomers(res.data.Customers || []))
      .catch(console.error);

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data.Products || []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "Quantity" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  // Validation function
 const validate = () => {
  const newErrors = {};

  if (!inputs.ShopName) newErrors.ShopName = "Please select a shop.";
  if (!inputs.ProductId) newErrors.ProductId = "Please select a product.";
  if (!inputs.OrderDate) newErrors.OrderDate = "Please select an order date.";
  if (!inputs.Quantity || inputs.Quantity < 1)
    newErrors.Quantity = "Quantity must be at least 1.";
  else if (!Number.isInteger(inputs.Quantity))
    newErrors.Quantity = "Quantity must be a whole number.";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop submission if validation fails

    try {
      await axios.post("http://localhost:5000/api/orders", {
        ShopName: inputs.ShopName,
        ProductId: Number(inputs.ProductId),
        OrderDate: inputs.OrderDate,
        Quantity: Number(inputs.Quantity),
      });
      navigate("/Order");
    } catch (err) {
      console.error(err);
      alert("Failed to add order");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Add New Order
        </h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Shop Name
          </label>
          <select
            name="ShopName"
            value={inputs.ShopName}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.ShopName ? "border-red-500" : "focus:ring-green-400"
            }`}
          >
            <option value="">-- Select Shop --</option>
            {customers.map((c) => (
              <option key={c.CustomerId} value={c.ShopName}>
                {c.ShopName} ({c.City})
              </option>
            ))}
          </select>
          {errors.ShopName && (
            <span className="text-red-600 text-sm mt-1">{errors.ShopName}</span>
          )}
        </div>

        {/* Product */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Product
          </label>
          <select
            name="ProductId"
            value={inputs.ProductId}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.ProductId ? "border-red-500" : "focus:ring-green-400"
            }`}
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.ProductId} value={p.ProductId}>
                {p.ProductName} ({p.MushroomType})
              </option>
            ))}
          </select>
          {errors.ProductId && (
            <span className="text-red-600 text-sm mt-1">{errors.ProductId}</span>
          )}
        </div>

        {/* Order Date */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Order Date
          </label>
          <input
            type="date"
            name="OrderDate"
            value={inputs.OrderDate}
            onChange={handleChange}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.OrderDate ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.OrderDate && (
            <span className="text-red-600 text-sm mt-1">{errors.OrderDate}</span>
          )}
        </div>

        {/* Quantity */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Quantity
          </label>
          <input
            type="number"
            name="Quantity"
            value={inputs.Quantity}
            onChange={handleChange}
            min="1"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.Quantity ? "border-red-500" : "focus:ring-green-400"
            }`}
          />
          {errors.Quantity && (
            <span className="text-red-600 text-sm mt-1">{errors.Quantity}</span>
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
            onClick={() =>
              setInputs({ ShopName: "", ProductId: "", OrderDate: "", Quantity: 1 })
            }
            className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddOrder;
