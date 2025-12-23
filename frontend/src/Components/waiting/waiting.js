import React from 'react';
import { useNavigate } from 'react-router-dom';

function Waiting() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/mushroomlogin.jpg')", // ✅ same as Login
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Transparent Card */}
      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Waiting for Role Assignment
        </h2>
        <p className="text-white/80 mb-6">
          Your account is currently pending. Please wait until an administrator assigns your role.
        </p>
        <button
          onClick={handleBackToLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Waiting;
