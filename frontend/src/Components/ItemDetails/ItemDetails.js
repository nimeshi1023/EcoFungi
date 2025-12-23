import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function ItemDetails(props) {
  const { _id, Item_code, Category, Item_name, Quantity, Unit, Received_date, Expired_date, Reorder_level, Description, Purchase_id } = props.item;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toISOString().split('T')[0];
  };

  const navigate = useNavigate();

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:5000/items/${_id}`);
      alert("✅ Item deleted successfully!");
      navigate(0); // Reload page
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("❌ Failed to delete item.");
    }
  }

   // Only calculate diffDays if Expired_date exists
let diffDays = null;
if (Expired_date) {
  const today = new Date();
  const expDate = new Date(Expired_date);
  diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
}

let rowClass = "border-t hover:bg-gray-50";

// Only apply coloring if diffDays is a number
if (diffDays !== null) {
  if (diffDays <= 7 && diffDays >= 0) {
    rowClass = "border-t bg-red-100 text-red-700 font-semibold"; 
  } else if (diffDays < 0) {
    rowClass = "border-t bg-[#D10000] text-white font-bold"; 
  }
}


  return (
    <tr className={rowClass}>
      <td className="px-4 py-2">{Item_code}</td>
      <td className="px-4 py-2">{Category}</td>
      <td className="px-4 py-2">{Item_name}</td>
      <td className="px-4 py-2">{Quantity}</td>
      <td className="px-4 py-2">{Unit}</td>
      <td className="px-4 py-2">{formatDate(Received_date)}</td>
      <td className="px-5 py-2">{formatDate(Expired_date)}</td>
      <td className="px-4 py-2">{Reorder_level}</td>
      <td className="px-4 py-2">{Description}</td>
      <td className="px-4 py-2">{Purchase_id}</td>
      <td className="px-4 py-2 flex gap-2">
        <Link to={`/itemdetails/${_id}`} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-blue-700 transition">
          Update
        </Link>
        <button onClick={deleteHandler} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ItemDetails;
