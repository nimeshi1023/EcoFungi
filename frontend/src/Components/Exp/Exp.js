import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Exp({ ex, onDelete }) {
  const { _id, date, expenseId, category, description, paymentMethod, amount } = ex;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toISOString().split("T")[0];
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Expense ID ${expenseId}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/expenses/${_id}`);
      // Notify parent component to remove this item from state
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <tr className="bg-white border-b border-green-200 hover:bg-[#A5D6A7] transition">
      <td className="px-4 py-2">{formatDate(date)}</td>
      <td className="px-4 py-2">{expenseId}</td>
      <td className="px-4 py-2">{category}</td>
      <td className="px-4 py-2">{description}</td>
      <td className="px-4 py-2">{paymentMethod}</td>
      <td className="px-4 py-2">Rs. {amount}</td>
      <td className="px-4 py-2 space-x-2">
        <Link
          to={`/exdetails/${_id}`}
          className="px-3 py-1 bg-[#4CAF50] text-white rounded hover:bg-[#1B5E20] transition"
        >
          Update
        </Link>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Exp;
