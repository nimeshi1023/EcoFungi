import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/users/login', {
        email,
        password,
      });

      const userData = res.data.user;
      sessionStorage.setItem('user', JSON.stringify(userData));

      if (res.data.user?.name) {
        sessionStorage.setItem('username', res.data.user.name);
      }

      localStorage.setItem('token', res.data.token);
      const role = res.data.role;

      if (role === 'pending') {
        navigate('/waiting');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(`/${role}-dashboard`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/mushroomlogin.jpg')", // ✅ real photo in public folder
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Transparent Form with Rotate Animation */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
        transition={{ 
          duration: 0.6,
          ease: "easeInOut"
        }}
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Mushroom Cultivation Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white/10 text-white placeholder-white/70"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white/10 text-white placeholder-white/70"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Don't have an account?{' '}
          <a
            href="/register"
            onClick={handleRegisterClick}
            className="text-green-300 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;