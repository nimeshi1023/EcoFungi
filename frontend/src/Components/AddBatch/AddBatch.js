import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BatchNav from "../BatchNav/BatchNav";
import Header from "../Header/Header";

function AddBatch() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    createDate: "",
    status: "Active", // default status
    quantity: "",
    removedQuantity: "",
    expireDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!inputs.createDate) tempErrors.createDate = "Create Date is required";
    if (!inputs.status) tempErrors.status = "Status is required";

    if (!inputs.quantity || inputs.quantity <= 0) {
      tempErrors.quantity = "Quantity must be greater than 0";
    }

    if (inputs.removedQuantity < 0) {
      tempErrors.removedQuantity = "Removed Quantity cannot be negative";
    }

    if (
      inputs.removedQuantity &&
      Number(inputs.removedQuantity) > Number(inputs.quantity)
    ) {
      tempErrors.removedQuantity = "Removed Quantity cannot exceed Quantity";
    }

    if (!inputs.expireDate) {
      tempErrors.expireDate = "Expire Date is required";
    } else if (inputs.createDate && inputs.expireDate <= inputs.createDate) {
      tempErrors.expireDate = "Expire Date must be after Create Date";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please add correct number ❌");
      return;
    }

    try {
      await sendRequest();
      alert("Batch added successfully ✅");
      history("/batchdetails");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding the batch ❌");
    }
  };

  const sendRequest = async () => {
    return await axios.post("http://localhost:5000/batches", {
      createDate: new Date(inputs.createDate),
      status: String(inputs.status),
      quantity: Number(inputs.quantity),
      removedQuantity: Number(inputs.removedQuantity),
      expireDate: new Date(inputs.expireDate),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixed on left */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-40">
        <BatchNav />
      </div>

      {/* Header fixed on top, only over main content */}
      <div className="fixed top-0 left-64 right-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-20 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Batch</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            {/* Create Date */}
            <label className="block mb-2 font-medium">Create Date</label>
            <input
              type="datetime-local"
              name="createDate"
              onChange={handleChange}
              value={inputs.createDate}
              className="w-full border rounded px-3 py-2 mb-1"
            />
            {errors.createDate && (
              <p className="text-red-500 text-sm mb-3">{errors.createDate}</p>
            )}

            {/* Status */}
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={inputs.status}
              className="w-full border rounded px-3 py-2 mb-1"
            >
              <option value="">-- Select Status --</option>
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mb-3">{errors.status}</p>
            )}

            {/* Quantity */}
            <label className="block mb-2 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              value={inputs.quantity}
              className="w-full border rounded px-3 py-2 mb-1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mb-3">{errors.quantity}</p>
            )}

            {/* Removed Quantity */}
            <label className="block mb-2 font-medium">Removed Quantity</label>
            <input
              type="number"
              name="removedQuantity"
              onChange={handleChange}
              value={inputs.removedQuantity}
              className="w-full border rounded px-3 py-2 mb-1"
            />
            {errors.removedQuantity && (
              <p className="text-red-500 text-sm mb-3">
                {errors.removedQuantity}
              </p>
            )}

            {/* Expire Date */}
            <label className="block mb-2 font-medium">Expire Date</label>
            <input
              type="datetime-local"
              name="expireDate"
              onChange={handleChange}
              value={inputs.expireDate}
              className="w-full border rounded px-3 py-2 mb-1"
            />
            {errors.expireDate && (
              <p className="text-red-500 text-sm mb-3">{errors.expireDate}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition w-full mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBatch;
