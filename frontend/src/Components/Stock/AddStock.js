import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddStock() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    ManufactureDate: "",
    MushroomType: "",
    ExpireDate: "",
    Unit: "",
  });
  const [errors, setErrors] = useState({});
  const [mushroomTypes, setMushroomTypes] = useState([]);

  // Fetch mushroom types from Product table
  useEffect(() => {
    const fetchMushroomTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Product");
        const products = res.data.Products || [];
        const types = [...new Set(products.map((p) => p.MushroomType))]; // unique
        setMushroomTypes(types);
      } catch (err) {
        console.error("Failed to fetch mushroom types:", err);
      }
    };
    fetchMushroomTypes();
  }, []);

  // Handle input changes
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
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!inputs.ManufactureDate) newErrors.ManufactureDate = "Manufacture date is required";
    else if (inputs.ManufactureDate > today)
      newErrors.ManufactureDate = "Manufacture date cannot be in the future";

    if (!inputs.MushroomType) newErrors.MushroomType = "Mushroom type is required";

    if (!inputs.Unit) newErrors.Unit = "Number of packets is required";
    else if (Number(inputs.Unit) <= 0) newErrors.Unit = "Number of packets must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    sendRequest().then(() => history("/Stock"));
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5000/Stock", {
      ManufactureDate: new Date(inputs.ManufactureDate),
      MushroomType: String(inputs.MushroomType),
      ExpireDate: new Date(inputs.ExpireDate),
      Unit: Number(inputs.Unit),
    });
    return res.data;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Add New Stock
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
              errors.ManufactureDate ? "border-red-500" : "border-green-200"
            }`}
          />
          {errors.ManufactureDate && <p className="text-red-500 text-sm mt-1">{errors.ManufactureDate}</p>}
        </div>

        {/* Mushroom Type */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">Mushroom Type</label>
          <select
            name="MushroomType"
            value={inputs.MushroomType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.MushroomType ? "border-red-500" : "border-green-200"
            }`}
          >
            <option value="">-- Select Mushroom Type --</option>
            {mushroomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.MushroomType && <p className="text-red-500 text-sm mt-1">{errors.MushroomType}</p>}
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
              errors.Unit ? "border-red-500" : "border-green-200"
            }`}
          />
          {errors.Unit && <p className="text-red-500 text-sm mt-1">{errors.Unit}</p>}
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
            onClick={() =>
              setInputs({ ManufactureDate: "", MushroomType: "", ExpireDate: "", Unit: "" })
            }
            className="flex-1 bg-gray-100 text-green-800 border border-green-200 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStock;
