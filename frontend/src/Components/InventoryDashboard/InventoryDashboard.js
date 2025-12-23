import React, { useEffect, useState } from "react";
import MainIntNav from "../MainIntNav/MainIntNav";
import Header from "../Header/Header";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function InventoryDashboard() {
  const [totalStock, setTotalStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Raw Material");

  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((res) => {
        setInventory(res.data.items);
        setTotalStock(res.data.items.length);
        const lowItems = res.data.items.filter(
          (item) => item.Quantity <= item.Reorder_level
        );
        setLowStock(lowItems.length);
      })
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/purchases")
      .then((res) => setPurchases(res.data.purchases || []))
      .catch((err) => console.error("Purchases fetch error:", err));

    axios
      .get("http://localhost:5000/suppliers")
      .then((res) => setSuppliers(res.data.suppliers))
      .catch((err) => console.error("Supplier fetch error:", err));
  }, []);

  const totalPurchaseCost = purchases.reduce((sum, p) => sum + (p.Price || 0), 0);

  const filteredItems = inventory.filter(
    (item) => item.Category === selectedCategory
  );

  const chartData = {
    labels: filteredItems.map((item) => item.Item_name),
    datasets: [
      {
        label: `Quantity in ${selectedCategory}`,
        data: filteredItems.map((item) => item.Quantity),
        backgroundColor: "#1B5E20",
      },
    ],
  };

  const purchasePieChartData = {
    labels: purchases.map((p) => p.Item_name),
    datasets: [
      {
        label: "Purchase Cost (Rs.)",
        data: purchases.map((p) => p.Price || 0),
        backgroundColor: [
          "#1B5E20", "#388E3C", "#81C784", "#A5D6A7", "#C8E6C9",
          "#66BB6A", "#43A047", "#2E7D32", "#B2DFDB", "#00796B"
        ],
      },
    ],
  };

  const purchasePieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Purchase Cost Distribution" },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="w-52 fixed top-0 left-0 h-screen overflow-y-auto">
        <MainIntNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-52 h-screen overflow-y-auto">
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 bg-gray-100 shadow-md">
          <Header />
          <div className="bg-white text-[#1B5E20] px-6 py-4 shadow-md rounded-md">
            <h1 className="text-3xl font-semibold">Inventory Management</h1>
            <p className="text-xl">Dashboard</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6 bg-white">
          {[
            { label: "Total Item Stock", value: totalStock, color: "text-black" },
            { label: "Low Item Stock", value: lowStock, color: "text-yellow-500" },
            { label: "Purchases", value: purchases.length, color: "text-red-500" },
            { label: "Suppliers", value: suppliers.length, color: "text-black" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-green-200/60 text-black p-4 rounded shadow-md flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg">📦</span>
                  <span className="text-sm font-semibold">{stat.label}</span>
                </div>
                <span className="text-xs opacity-70">↗</span>
              </div>
              <div
                className={`text-3xl font-bold mt-2 ${
                  stat.color ? stat.color + " drop-shadow" : "text-white"
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="flex flex-col md:flex-row px-6 py-4 gap-4">
          <div className="w-full md:w-1/4 bg-white text-black p-6 rounded shadow-md min-h-[250px]">
            <h2 className="text-lg font-semibold mb-2">Value of Stock</h2>
            <p className="text-3xl font-bold mb-6">Rs.{totalPurchaseCost.toFixed(2)}</p>
            <h3 className="text-md mb-2">Stock Purchases</h3>
            <div className="bg-white rounded-lg p-2 w-full h-80 flex items-center justify-center">
              <Pie data={purchasePieChartData} options={purchasePieOptions} />
            </div>
          </div>

          <div className="w-full md:w-3/4 bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <select
                className="border border-gray-300 px-3 py-1 rounded"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Raw Material">Raw Material</option>
                <option value="Packaging">Packaging</option>
                <option value="Spores/Spawn">Spores/Spawn</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <h2 className="text-xl font-bold mb-4 text-center">Inventory Stock</h2>
            <p className="text-center text-sm text-gray-600 mb-2">Quantity by Item</p>

            <div className="h-72 flex justify-center items-center">
              <Bar data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;
