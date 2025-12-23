import React from "react";
import { useNavigate } from "react-router-dom";

function StockD(props) {
  const { StockId, ManufactureDate, MushroomType, ExpireDate, Unit } = props.Stock;
  const { onDelete } = props;
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/Stock/${StockId}`);
  };

  // Confirm before delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      onDelete(StockId);
    }
  };

  // Improved Expiry Check
  const parsedExpire = ExpireDate ? new Date(ExpireDate) : null;
  let isExpired = false;
  if (parsedExpire instanceof Date && !isNaN(parsedExpire)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expireDateOnly = new Date(parsedExpire);
    expireDateOnly.setHours(0, 0, 0, 0);
    isExpired = expireDateOnly < today;
  }

  const formatDateOnly = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toISOString().split("T")[0];
  };

  const rowClass = isExpired ? "bg-red-200" : "even:bg-gray-50 bg-white";
  const expireCellClass = isExpired ? "text-red-800 font-semibold" : "text-green-800";

  return (
    <tr className={`hover:bg-teal-100 ${rowClass}`}>
      <td className="py-3 px-4 border">{StockId}</td>
      <td className="py-3 px-4 border">{formatDateOnly(ManufactureDate)}</td>
      <td className="py-3 px-4 border">{MushroomType}</td>
      <td className={`py-3 px-4 border ${expireCellClass}`}>{formatDateOnly(ExpireDate)}</td>
      <td className="py-3 px-4 border">{Unit}</td>
      <td className="py-3 px-4 border flex gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default StockD;
