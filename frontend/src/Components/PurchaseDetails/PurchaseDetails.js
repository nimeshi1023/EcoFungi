import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function PurchaseDetails(props) {
 const navigate = useNavigate(); // Hook always first

  if (!props.purchase) return null;

  const { _id, Purchase_id, Supplier_id, Item_name, Purchase_date, Price } =
    props.purchase;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString() ;
  };

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;

    try {
      await axios.delete(`http://localhost:5000/purchases/${_id}`);
      alert("✅ Purchase deleted successfully!"); // Success alert
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      alert("❌ Failed to delete purchase."); // Error alert
    }
  };
  return (
    <tr className="border-t hover:bg-gray-100 transition">
      <td className="px-4 py-3 text-center">{Purchase_id}</td>
      <td className="px-4 py-3 text-gray-800">{Supplier_id}</td>
      <td className="px-4 py-3">{Item_name}</td>
      <td className="px-4 py-3">{formatDate(Purchase_date)}</td>
      <td className="px-4 py-3 font-semibold text-gray-700">Rs. {Price}</td>
      <td className="px-4 py-3 flex justify-center gap-3">
        <Link
          to={`/purchasedetails/${_id}`}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 transition duration-200"
        >
          Update
        </Link>
        <button
          onClick={deleteHandler}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition duration-200"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default PurchaseDetails;
