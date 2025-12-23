import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, age, address, password } = formData;

    // Required fields check
    if (!name || !email || !age || !address || !password) {
      setError('All fields are required');
      return;
    }

    // Age validation
    if (!/^\d+$/.test(age)) {
      setError('Age must be a number');
      return;
    }

    // Name validation: letters and spaces, min 2 characters
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      setError('Name must contain only letters and at least 2 characters');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation: min 8 chars, uppercase, lowercase, number, special char
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
      );
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/users/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/mushreg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Glassmorphic Form */}
      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Manager Registration
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 border border-red-300 p-2 rounded mb-4 text-sm font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-2 rounded mb-4 text-sm font-medium">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-white/50 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-white/50 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="w-full px-4 py-2 border border-white/50 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-white/50 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-white/50 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-white mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-300 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
