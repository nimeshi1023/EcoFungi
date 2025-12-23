import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BatchNav from "../BatchNav/BatchNav";

function UpdateBatch() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/batches/${id}`);
        setInputs(res.data.batch);
      } catch (error) {
        console.error("Error fetching batch:", error);
        alert("Failed to load batch details ❌");
      }
    };
    fetchHandler();
  }, [id]);

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

  const sendRequest = async () => {
    return await axios.put(`http://localhost:5000/batches/${id}`, {
      createDate: new Date(inputs.createDate),
      status: String(inputs.status),
      quantity: Number(inputs.quantity),
      removedQuantity: Number(inputs.removedQuantity),
      expireDate: new Date(inputs.expireDate),
    });
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fix the validation errors before submitting ❌");
      return;
    }

    try {
      await sendRequest();
      alert("Batch updated successfully ✅");
      navigate(`/batchdetails`);
    } catch (error) {
      console.error("Error updating batch:", error);
      alert("Something went wrong while updating the batch ❌");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="fixed h-full">
        <BatchNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Batch
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Create Date */}
            <div>
              <label className="block font-medium text-gray-700">
                Create Date
              </label>
              <input
                type="datetime-local"
                name="createDate"
                onChange={handleChange}
                value={inputs.createDate || ""}
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              />
              {errors.createDate && (
                <p className="text-red-500 text-sm">{errors.createDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block font-medium text-gray-700">Status</label>
              <input
                type="text"
                name="status"
                onChange={handleChange}
                value={inputs.status || ""}
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                onChange={handleChange}
                value={inputs.quantity || ""}
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            {/* Removed Quantity */}
            <div>
              <label className="block font-medium text-gray-700">
                Removed Quantity
              </label>
              <input
                type="number"
                name="removedQuantity"
                onChange={handleChange}
                value={inputs.removedQuantity || ""}
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              />
              {errors.removedQuantity && (
                <p className="text-red-500 text-sm">
                  {errors.removedQuantity}
                </p>
              )}
            </div>

            {/* Expire Date */}
            <div>
              <label className="block font-medium text-gray-700">
                Expire Date
              </label>
              <input
                type="datetime-local"
                name="expireDate"
                onChange={handleChange}
                value={inputs.expireDate || ""}
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              />
              {errors.expireDate && (
                <p className="text-red-500 text-sm">{errors.expireDate}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBatch;
