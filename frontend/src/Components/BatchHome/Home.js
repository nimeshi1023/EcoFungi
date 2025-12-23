import React, { useEffect, useState } from "react";
import BatchNav from "../BatchNav/BatchNav";
import Header from "../Header/Header"; 
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const URL = "http://localhost:5000/batches";

const Home = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data.batches;

      setBatches(
        dataArray.map((batch) => ({
          ...batch,
          remainingQuantity: batch.quantity - batch.removedQuantity,
        }))
      );
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const formatXAxis = (tick) => {
    return `Batch ${tick}`; // show user-friendly batch ID format
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const batch = payload[0].payload;
      return (
        <div className="bg-white border shadow-md p-3 rounded-lg">
          <p className="font-bold text-gray-700">Batch ID: {batch.batchid}</p>
          <p>Create Date: {new Date(batch.createDate).toLocaleDateString()}</p>
          <p>Expire Date: {new Date(batch.expireDate).toLocaleDateString()}</p>
          <p>Status: {batch.status}</p>
          <p>Quantity: {batch.quantity}</p>
          <p>Removed: {batch.removedQuantity}</p>
          <p>Remaining: {batch.remainingQuantity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/*  Sidebar fixed on left */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-40">
        <BatchNav />
      </div>

      {/*  Header fixed on top, only over main content */}
      <div className="fixed top-0 left-64 right-0 z-50">
        <Header />
      </div>

      {/*  Main Content */}
      <div className="ml-64 pt-20 p-6 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Batch Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Visual overview of batch quantities, removals, and remaining stock
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading batch data...</span>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Batch Data Available</h3>
            <p className="text-gray-500">Start by creating your first batch to see analytics here.</p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-7xl">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Batches</p>
                    <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
                  </div>
                  <div className="text-blue-500 text-2xl">📦</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)}
                    </p>
                  </div>
                  <div className="text-green-500 text-2xl">📈</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Removed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {batches.reduce((sum, batch) => sum + (batch.removedQuantity || 0), 0)}
                    </p>
                  </div>
                  <div className="text-red-500 text-2xl">📉</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Available Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {batches.reduce((sum, batch) => sum + (batch.remainingQuantity || 0), 0)}
                    </p>
                  </div>
                  <div className="text-purple-500 text-2xl">✅</div>
                </div>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Batch Quantity Overview</h2>
              <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={batches}
                margin={{ top: 30, right: 30, left: 60, bottom: 80 }}
                barGap={4}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="batchid"
                  tickFormatter={formatXAxis}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                >
                  <Label
                    value="Batch ID"
                    offset={-40}
                    position="insideBottom"
                  />
                </XAxis>
                <YAxis>
                  <Label value="Quantity" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip content={customTooltip} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="quantity"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Total Quantity"
                  stroke="#1d4ed8"
                  strokeWidth={1}
                />
                <Bar
                  dataKey="removedQuantity"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Removed Quantity"
                  stroke="#dc2626"
                  strokeWidth={1}
                />
                <Bar
                  dataKey="remainingQuantity"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Available Stock"
                  stroke="#059669"
                  strokeWidth={1}
                />
              </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
