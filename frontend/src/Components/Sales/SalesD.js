import React from "react";
import { useNavigate } from "react-router-dom";

function SalesD({ sale, onDelete }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/Sales/${sale.SalesId}`);
  };

  return (
    <tr className="hover:bg-teal-100 even:bg-gray-50">
      <td className="px-4 py-2 border">{sale.SalesId}</td>
      <td className="px-4 py-2 border">{sale.ShopName}</td>
      <td className="px-4 py-2 border">{sale.ProductName}</td>
      <td className="px-4 py-2 border">{sale.NumberOfPackets}</td>
      <td className="px-4 py-2 border">{sale.NumberOfReturns}</td>
      <td className="px-4 py-2 border">
        {sale.Date ? new Date(sale.Date).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-4 py-2 border">
      {sale.TotalPrice !== undefined && sale.TotalPrice !== null
      ? parseFloat(sale.TotalPrice).toFixed(2) : "0.00"}
      </td>

      <td className="px-4 py-2 border flex gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          onClick={() => onDelete(sale.SalesId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default SalesD;
