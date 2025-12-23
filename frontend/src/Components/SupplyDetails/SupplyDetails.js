import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SupplyDetails(props) {
  const { _id, Supplier_id, Supplier_name, Phone_number, Email, Address } =
    props.supplier;

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await axios.delete(`http://localhost:5000/suppliers/${_id}`);
      alert("✅ Supplier deleted successfully!"); // Success alert
      props.onDelete(_id); // ⬅️ Call parent handler to update UI
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("❌ Failed to delete supplier.");
    }
  };

  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-center">{Supplier_id}</td>
      <td className="px-4 py-3 text-gray-800">{Supplier_name}</td>
      <td className="px-4 py-3">{Phone_number}</td>
      <td className="px-4 py-3">{Email}</td>
      <td className="px-4 py-3">{Address}</td>
      <td className="px-4 py-3 flex justify-center gap-3">
        <Link
          to={`/supplierdetails/${_id}`}
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

export default SupplyDetails;
