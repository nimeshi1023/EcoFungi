import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const BatchManagerDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Batch Manager Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      <p>Welcome, Batch Manager!</p>
    </div>
  );
};
export default BatchManagerDashboard;