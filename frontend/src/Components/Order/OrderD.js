import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function OrderD({ order, onDelete }) {
  // Editable only if the order is not linked to a sale
  const isEditable = !order.SalesId;

  const handleDelete = () => {
    if (!isEditable) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete order ${order.OrderId}?`
    );
    if (confirmDelete) {
      onDelete(order.OrderId);
    }
  };

  return (
    <tr>
      <td className="border px-4 py-2">{order.OrderId}</td>
      <td className="border px-4 py-2">{order.ShopName}</td>
      <td className="border px-4 py-2">{order.ProductId}</td>
      <td className="border px-4 py-2">{order.Quantity}</td>
      <td className="border px-4 py-2">{new Date(order.OrderDate).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{order.Status}</td>
      <td className="border px-4 py-2">
        {order.DeliveredDate ? new Date(order.DeliveredDate).toLocaleDateString() : "Not Delivered"}
      </td>
      <td className="border px-4 py-2">{order.SalesId || "N/A"}</td>

      {/* Actions */}
      <td className="border px-4 py-2 text-center flex justify-center gap-2">
        {/* Edit button */}
        <Link
          to={isEditable ? `/Order/${order.OrderId}` : "#"}
          className={`px-2 py-1 rounded text-white ${
            isEditable ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isEditable) e.preventDefault();
          }}
        >
          <FaEdit />
        </Link>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={`px-2 py-1 rounded text-white ${
            isEditable ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditable}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default OrderD;
