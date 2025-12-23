import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SupplyNav from "../SupplyNav/SupplyNav";

function UpdateSupplier() {
  const [inputs, setInputs] = useState({
    Supplier_id: '',
    Supplier_name: '',
    Phone_number: '',
    Email: '',
    Address: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing supplier
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/suppliers/${id}`);
        if (res.data && res.data.suppliers) {
          setInputs({
            Supplier_id: res.data.suppliers.Supplier_id || '',
            Supplier_name: res.data.suppliers.Supplier_name || '',
            Phone_number: res.data.suppliers.Phone_number?.toString() || '',
            Email: res.data.suppliers.Email || '',
            Address: res.data.suppliers.Address || ''
          });
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
      }
    };
    fetchSupplier();
  }, [id]);

  // Field validation
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'Supplier_name':
        if (!value.trim()) error = "Supplier name is required.";
        else if (value.length < 2) error = "Supplier name must be at least 2 characters.";
        else if (!/^[A-Za-z\s.]+$/.test(value)) error = "Supplier name can contain letters, spaces, and dots only.";
        break;
      case 'Phone_number':
        if (!/^0\d{9}$/.test(value)) error = "Phone number must start with 0 and be exactly 10 digits.";
        break;
      case 'Email':
        if (!value.trim()) error = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim()))
          error = "Email format is invalid.";
        break;
      case 'Address':
        if (!value.trim()) error = "Address is required.";
        else if (value.length < 5) error = "Address must be at least 5 characters.";
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone number
    if (name === "Phone_number" && !/^\d*$/.test(value)) return;

    setInputs(prev => ({ ...prev, [name]: value }));

    // Real-time validation if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur to mark field as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate all fields before submitting
  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach(key => {
      const error = validateField(key, inputs[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/suppliers/${id}`, {
        Supplier_name: inputs.Supplier_name,
        Phone_number: inputs.Phone_number,
        Email: inputs.Email,
        Address: inputs.Address
      });

      alert("✅ Supplier updated successfully!");
      navigate("/supplierdetails");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update supplier. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SupplyNav />
      <div className="flex-1 flex justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Update Supplier Details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Supplier ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier ID</label>
              <input
                type="text"
                name="Supplier_id"
                value={inputs.Supplier_id}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier Name</label>
              <input
                type="text"
                name="Supplier_name"
                value={inputs.Supplier_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.Supplier_name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {touched.Supplier_name && errors.Supplier_name && (
                <p className="text-red-500 text-sm mt-1">{errors.Supplier_name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="Phone_number"
                value={inputs.Phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.Phone_number ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {touched.Phone_number && errors.Phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.Phone_number}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="text"
                name="Email"
                value={inputs.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.Email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {touched.Email && errors.Email && (
                <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <textarea
                name="Address"
                value={inputs.Address}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.Address ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {touched.Address && errors.Address && (
                <p className="text-red-500 text-sm mt-1">{errors.Address}</p>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateSupplier;
