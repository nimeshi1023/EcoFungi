import React from "react";
import { useNavigate } from "react-router-dom";

function CustomerD(props) {
  const { CustomerId, ShopName, OwnerName, Email, PhoneNo, City, Status } =
    props.Customer;
  const { onDelete } = props;
  const navigate = useNavigate();

  const handleUpdate = () => {
     console.log("Navigating to update:", CustomerId);
    navigate(`/Customer/${CustomerId}`);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete customer "${ShopName}" (ID: ${CustomerId})?`
    );
    if (confirmDelete) {
      onDelete(CustomerId);
    }
  };

  return (
    <tr className="hover:bg-teal-100 even:bg-gray-50">
      <td className="px-4 py-2 border">{CustomerId}</td>
      <td className="px-4 py-2 border">{ShopName}</td>
      <td className="px-4 py-2 border">{OwnerName}</td>
      <td className="px-4 py-2 border">{Email}</td>
      <td className="px-4 py-2 border">{PhoneNo}</td>
      <td className="px-4 py-2 border">{City}</td>
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

export default CustomerD;
