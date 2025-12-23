import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ExNav from "../ExNav/ExNav";

function Expen() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    date: "",
    expenseId: "",
    category: "",
    description: "",
    paymentMethod: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch purchase data
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/purchases");

        if (Array.isArray(res.data)) {
          setPurchases(res.data);
        } else if (Array.isArray(res.data.purchases)) {
          setPurchases(res.data.purchases);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    fetchPurchases();
  }, []);

  // Recalculate monthly total whenever date or purchases change
  useEffect(() => {
    if (!inputs.date) {
      setMonthlyTotal(0);
      return;
    }

    const selectedDate = new Date(inputs.date);
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    const total = purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.Purchase_date); // ✅ Correct field
        return (
          purchaseDate.getMonth() + 1 === selectedMonth &&
          purchaseDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, purchase) => sum + (purchase.Price || 0), 0); // ✅ Correct field

    console.log("📌 Monthly Inventory Total:", total); // Debug log
    setMonthlyTotal(total);
  }, [inputs.date, purchases]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate inputs
  const validate = () => {
    const newErrors = {};

    if (!inputs.date) {
      newErrors.date = "Date is required";
    } else if (new Date(inputs.date) > new Date()) {
      newErrors.date = "Date cannot be in the future";
    }

    if (!inputs.category) {
      newErrors.category = "Category is required";
    }

    if (inputs.description && inputs.description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }

    const amountValue =
      inputs.category === "Inventory" ? monthlyTotal : Number(inputs.amount);

    if (!amountValue || amountValue < 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (amountValue > 1000000) {
      newErrors.amount = "Amount cannot exceed 1,000,000";
    }

    if (inputs.category !== "Inventory" && inputs.amount) {
      if (!/^\d+(\.\d{1,2})?$/.test(inputs.amount)) {
        newErrors.amount = "Amount can have maximum 2 decimal places";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/expenses", {
        date: new Date(inputs.date),
        expenseId: String(inputs.expenseId),
        category: String(inputs.category),
        description: String(inputs.description),
        paymentMethod:
        inputs.category === "Inventory" ? undefined : inputs.paymentMethod || undefined,

        amount:
          inputs.category === "Inventory"
            ? Number(monthlyTotal) || 0
            : Number(inputs.amount),
      });

      setSuccessMessage("✅ Expense added successfully!");

      setTimeout(() => {
        navigate("/exdetails");
      }, 1000);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ExNav />

      <div className="ml-52 flex-1 flex justify-center items-center p-10">
        <div className="max-w-lg w-full p-6 bg-white shadow-md rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
            🍄 Add Mushroom Cultivation Expense
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Date */}
            <label className="flex flex-col text-green-800 font-medium">
              Date:
              <input
                type="date"
                name="date"
                required
                value={inputs.date ? inputs.date.slice(0, 10) : ""}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.date && (
                <span className="text-red-600 text-sm">{errors.date}</span>
              )}
            </label>

            {/* Category */}
            <label className="flex flex-col text-green-800 font-medium">
              Category:
              <select
                name="category"
                value={inputs.category}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Category --</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                <option value="Transportation">Transportation</option>
                <option value="Inventory">Inventory</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <span className="text-red-600 text-sm">{errors.category}</span>
              )}
            </label>

            {/* Description */}
            <label className="flex flex-col text-green-800 font-medium">
              Description:
              <textarea
                name="description"
                placeholder="Optional notes about this expense"
                value={inputs.description}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.description && (
                <span className="text-red-600 text-sm">{errors.description}</span>
              )}
            </label>

            {/* Payment Method (Optional) */}
            {inputs.category !== "Inventory" && (
              <label className="flex flex-col text-green-800 font-medium">
                Payment Method:
                <select
                  name="paymentMethod"
                  value={inputs.paymentMethod}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">-- Select Method (Optional) --</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </label>
            )}

            {/* Amount */}
            <label className="flex flex-col text-green-800 font-medium">
            Amount:
            <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={inputs.category === "Inventory" ? monthlyTotal : inputs.amount}
            onChange={handleChange}
            readOnly={inputs.category === "Inventory"}
            required={inputs.category !== "Inventory"}  // ✅ Only required if NOT Inventory
            className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.amount && (
          <span className="text-red-600 text-sm">{errors.amount}</span>
          )}
        </label>


            <button
              type="submit"
              className="mt-4 p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
            >
              Add Expense
            </button>
          </form>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300 text-center font-semibold">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expen;
