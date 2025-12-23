import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ManufactureDate: "",
    MushroomType: "",
    ExpireDate: "",
    Unit: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [mushroomTypes, setMushroomTypes] = useState([]);

  // Fetch stock data
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Stock/${id}`);
        const stockData = res.data.stock;
        if (!stockData) {
          setError("Stock data not found");
          setLoading(false);
          return;
        }
        setInputs(stockData);
        setOriginalData(stockData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stock:", err);
        setError("Failed to load stock data");
        setLoading(false);
      }
    };

    const fetchMushroomTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Product");
        const products = res.data.Products || [];
        const types = [...new Set(products.map((p) => p.MushroomType))];
        setMushroomTypes(types);
      } catch (err) {
        console.error("Failed to fetch mushroom types:", err);
      }
    };

    fetchStock();
    fetchMushroomTypes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-set ExpireDate if ManufactureDate changes
      if (name === "ManufactureDate" && value) {
        const manuDate = new Date(value);
        manuDate.setDate(manuDate.getDate() + 2); // +2 days
        updated.ExpireDate = manuDate.toISOString().split("T")[0];
      }

      return updated;
    });
  };

  const validate = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!inputs.ManufactureDate) errors.ManufactureDate = "Manufacture date is required";
    else if (inputs.ManufactureDate > today)
      errors.ManufactureDate = "Manufacture date cannot be in the future";

    if (!inputs.MushroomType) errors.MushroomType = "Mushroom type is required";

    if (!inputs.Unit) errors.Unit = "Number of packets is required";
    else if (Number(inputs.Unit) <= 0) errors.Unit = "Number of packets must be positive";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    if (originalData) {
      setInputs(originalData);
      setValidationErrors({});
    }
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/Stock/${id}`, {
        ManufactureDate: new Date(inputs.ManufactureDate),
        MushroomType: String(inputs.MushroomType),
        ExpireDate: new Date(inputs.ExpireDate),
        Unit: Number(inputs.Unit),
      });
      return res.data;
    } catch (err) {
      console.error("Error updating Stock:", err);
      setError("Failed to update Stock");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await sendRequest();
    navigate("/Stock");
  };

  if (loading) return <p className="text-gray-600">Loading Stock data...</p>;
  if (error) return <p className="text-red-500 font-semibold">{error}</p>;
  if (!inputs) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Update Stock
        </h2>

        {/* Manufacture Date */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Manufacture Date</label>
          <input
            type="date"
            name="ManufactureDate"
            value={inputs.ManufactureDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              validationErrors.ManufactureDate ? "border-red-500" : "border-green-200"
            }`}
          />
          {validationErrors.ManufactureDate && <p className="text-red-500 text-sm mt-1">{validationErrors.ManufactureDate}</p>}
        </div>

        {/* Mushroom Type */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Mushroom Type</label>
          <select
            name="MushroomType"
            value={inputs.MushroomType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              validationErrors.MushroomType ? "border-red-500" : "border-green-200"
            }`}
          >
            <option value="">-- Select Mushroom Type --</option>
            {mushroomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {validationErrors.MushroomType && <p className="text-red-500 text-sm mt-1">{validationErrors.MushroomType}</p>}
        </div>

        {/* Expire Date (Read-Only) */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Expire Date</label>
          <input
            type="date"
            name="ExpireDate"
            value={inputs.ExpireDate}
            readOnly
            className="w-full px-3 py-2 border border-green-200 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Unit */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Number Of Packets</label>
          <input
            type="number"
            name="Unit"
            value={inputs.Unit}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              validationErrors.Unit ? "border-red-500" : "border-green-200"
            }`}
          />
          {validationErrors.Unit && <p className="text-red-500 text-sm mt-1">{validationErrors.Unit}</p>}
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
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-100 text-green-800 border border-green-200 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateStock;
