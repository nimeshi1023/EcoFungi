import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductD(props) {
  const { ProductId, ProductName, MushroomType, UnitPrice, Status } = props.Product;
  const { onDelete } = props;
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/Product/${ProductId}`);
  };

  const handleDelete = () => {
    // Show confirmation alert
    const confirmDelete = window.confirm(`Are you sure you want to delete "${ProductName}"?`);
    if (confirmDelete) {
      onDelete(ProductId);
    }
  };

  return (
    <tr className="hover:bg-teal-100 even:bg-gray-50">
      <td className="px-4 py-2 border">{ProductId}</td>
      <td className="px-4 py-2 border">{ProductName}</td>
      <td className="px-4 py-2 border">{MushroomType}</td>
      <td className="px-4 py-2 border">{UnitPrice}</td>
      <td className="px-4 py-2 border">{Status}</td>
      <td className="px-4 py-2 border flex gap-2">
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

export default ProductD;
