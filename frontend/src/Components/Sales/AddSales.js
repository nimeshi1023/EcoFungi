import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSales() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inputs, setInputs] = useState({
    ShopName: "",
    ProductId: "",
    Date: "",
    NumberOfPackets: 0,
    NumberOfReturns: 0,
    TotalPrice: 0
  });
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0]; // For max attribute

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Customer");
        setCustomers(res.data.Customers || []);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Product");
        setProducts(res.data.Products || res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: (name === "NumberOfPackets" || name === "NumberOfReturns") ? Number(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: "" })); // clear error on change
  };

  // Auto-calculate TotalPrice
  useEffect(() => {
    const selectedProduct = products.find(p => String(p.ProductId) === String(inputs.ProductId));
    if (selectedProduct) {
      const unitPrice = Number(selectedProduct.UnitPrice) || 0;
      const total = (inputs.NumberOfPackets - inputs.NumberOfReturns) * unitPrice;
      setInputs(prev => ({ ...prev, TotalPrice: total }));
    } else {
      setInputs(prev => ({ ...prev, TotalPrice: 0 }));
    }
  }, [inputs.NumberOfPackets, inputs.NumberOfReturns, inputs.ProductId, products]);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!inputs.ShopName) newErrors.ShopName = "Please select a shop.";
    if (!inputs.ProductId) newErrors.ProductId = "Please select a product.";
    if (!inputs.Date) newErrors.Date = "Please select a sale date.";
    else if (new Date(inputs.Date) > new Date()) newErrors.Date = "Sale date cannot be in the future.";
    if (inputs.NumberOfPackets < 0) newErrors.NumberOfPackets = "Number of packets cannot be negative.";
    if (inputs.NumberOfReturns < 0) newErrors.NumberOfReturns = "Number of returns cannot be negative.";
    if (inputs.NumberOfReturns > inputs.NumberOfPackets) newErrors.NumberOfReturns = "Returns cannot exceed packets.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ShopName: inputs.ShopName,
        ProductId: Number(inputs.ProductId),
        Date: inputs.Date,
        NumberOfPackets: Number(inputs.NumberOfPackets),
        NumberOfReturns: Number(inputs.NumberOfReturns),
        TotalPrice: Number(inputs.TotalPrice)
      };
      await axios.post("http://localhost:5000/Sale", payload);
      navigate("/Sales");
    } catch (err) {
      console.error(err);
      alert("Failed to add sale");
    }
  };

  const handleReset = () => {
    setInputs({
      ShopName: "",
      ProductId: "",
      Date: "",
      NumberOfPackets: 0,
      NumberOfReturns: 0,
      TotalPrice: 0
    });
    setErrors({});
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Add New Sale</h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Shop Name</label>
          <select name="ShopName" value={inputs.ShopName} onChange={handleChange}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.ShopName ? "border-red-500" : ""}`}>
            <option value="">-- Select Shop --</option>
            {customers.map(c => <option key={c.CustomerId} value={c.ShopName}>{c.ShopName} ({c.City})</option>)}
          </select>
          {errors.ShopName && <span className="text-red-600 text-sm mt-1">{errors.ShopName}</span>}
        </div>

        {/* Product */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Product</label>
          <select name="ProductId" value={inputs.ProductId} onChange={handleChange}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.ProductId ? "border-red-500" : ""}`}>
            <option value="">-- Select Product --</option>
            {products.map(p => <option key={p.ProductId} value={p.ProductId}>{p.ProductName} ({p.MushroomType})</option>)}
          </select>
          {errors.ProductId && <span className="text-red-600 text-sm mt-1">{errors.ProductId}</span>}
        </div>

        {/* Sale Date */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Sale Date</label>
          <input type="date" name="Date" value={inputs.Date} onChange={handleChange} max={today}
                 className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.Date ? "border-red-500" : ""}`}/>
          {errors.Date && <span className="text-red-600 text-sm mt-1">{errors.Date}</span>}
        </div>

        {/* Number of Packets */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Number of Packets</label>
          <input type="number" name="NumberOfPackets" value={inputs.NumberOfPackets} onChange={handleChange} min="0"
                 className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.NumberOfPackets ? "border-red-500" : ""}`}/>
          {errors.NumberOfPackets && <span className="text-red-600 text-sm mt-1">{errors.NumberOfPackets}</span>}
        </div>

        {/* Number of Returns */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Number of Returns</label>
          <input type="number" name="NumberOfReturns" value={inputs.NumberOfReturns} onChange={handleChange} min="0"
                 className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.NumberOfReturns ? "border-red-500" : ""}`}/>
          {errors.NumberOfReturns && <span className="text-red-600 text-sm mt-1">{errors.NumberOfReturns}</span>}
        </div>

        {/* Total Price */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Total Price</label>
          <input type="number" name="TotalPrice" value={Number(inputs.TotalPrice).toFixed(2)} readOnly
                 className="px-3 py-2 border rounded-lg bg-gray-100"/>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button type="submit" className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">Submit</button>
          <button type="reset" onClick={handleReset} className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition">Clear</button>
        </div>
      </form>
    </div>
  );
}

export default AddSales;
