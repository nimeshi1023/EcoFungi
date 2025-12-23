import React, { useEffect, useState } from "react";
import PurchaseNav from "../PurchaseNav/PurchaseNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import PurchaseDetails from "../PurchaseDetails/PurchaseDetails";
import { FaShoppingCart } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const URL = "http://localhost:5000/purchases";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [originalPurchases, setOriginalPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [inputs, setInputs] = useState({ Price: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(URL);
        const fetched = res.data.purchases || [];
        setPurchases(fetched);
        setOriginalPurchases(fetched);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    fetchPurchases();
  }, []);

  // Auto search logic
 useEffect(() => {
  const trimmedQuery = searchQuery.trim().toLowerCase();

  if (trimmedQuery === "") {
    setPurchases(originalPurchases);
    setNoResults(false);
  } else {
    const filtered = originalPurchases.filter(
      (purchase) =>
        purchase.Purchase_id?.toString().toLowerCase().includes(trimmedQuery) ||
        purchase.Item_name?.toLowerCase().startsWith(trimmedQuery)
    );

    setPurchases(filtered);
    setNoResults(filtered.length === 0);
  }
}, [searchQuery, originalPurchases]);




  // Delete purchase
  const handleDelete = (id) => {
    setPurchases((prev) => prev.filter((p) => p._id !== id));
    setOriginalPurchases((prev) => prev.filter((p) => p._id !== id));
    axios.delete(`${URL}/${id}`).catch((err) => console.error(err));
  };

  // Validate price input
  const validatePrice = () => {
    let newErrors = {};
    if (inputs.Price === "") {
      newErrors.Price = "Price is required.";
    } else {
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      if (!priceRegex.test(inputs.Price)) {
        newErrors.Price = "Price must be a non-negative number with up to 2 decimals.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update price
  const handleUpdatePrice = (id) => {
    if (!validatePrice()) return;

    const updatedPurchase = {
      Price: parseFloat(inputs.Price),
    };

    axios
      .put(`${URL}/${id}`, updatedPurchase)
      .then(() => {
        setPurchases((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...updatedPurchase } : p))
        );
        setOriginalPurchases((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...updatedPurchase } : p))
        );
        setInputs({ Price: "" });
      })
      .catch((err) => console.error(err));
  };

  // Monthly bar chart data
  const getMonthlyCostData = () => {
    const monthMap = {};
    purchases.forEach((p) => {
      if (!p.Purchase_date || !p.Price) return;
      const date = new Date(p.Purchase_date);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });
      monthMap[month] = (monthMap[month] || 0) + parseFloat(p.Price || 0);
    });

    const sortedMonths = Object.keys(monthMap).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Total Cost (Rs)",
          data: sortedMonths.map((month) => monthMap[month]),
          backgroundColor: "rgba(25, 113, 40, 0.6)",
        },
      ],
    };
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <PurchaseNav />
      </div>

      {/* Main Content */}
      <div className="ml-[200px] p-6 w-full">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-green-700 text-4xl" />
            <h1 className="text-3xl font-bold text-gray-800">Purchased Items</h1>
          </div>
          {/* Total Purchases Card */}
          <div className="bg-gray-100 shadow px-6 py-3 rounded-xl text-center mt-4 md:mt-0">
            <p className="text-xl font-bold text-gray-700">{purchases.length}</p>
            <p className="text-gray-500 text-sm">TOTAL PURCHASES</p>
          </div>
        </div>

        {/* Search Bar (no button) */}
        {/* Search bar */}
<div className="bg-white rounded-2xl shadow-md p-4 mb-6">
  <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="🔎 Search by Purchase ID or Item Name..."
      className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
    />
  </div>
</div>


        {noResults && (
          <div className="text-red-500 font-medium mb-4 text-center">
            No matching purchases found.
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Purchase ID</th>
                <th className="px-4 py-3 text-left">Supplier ID</th>
                <th className="px-4 py-3 text-left">Item Name</th>
                <th className="px-4 py-3 text-left">Purchase Date</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, i) => (
                  <PurchaseDetails
                    key={i}
                    purchase={purchase}
                    onDelete={handleDelete}
                    onUpdate={handleUpdatePrice}
                    inputs={inputs}
                    setInputs={setInputs}
                    errors={errors}
                  />
                ))
              ) : (
                !noResults && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      Loading or no purchases available.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Monthly Cost Chart */}
        {purchases.length > 0 && searchQuery.trim() === "" && (
          <div className="w-full flex justify-center mt-12">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 w-[650px]">
              <h2 className="text-xl font-bold mb-4 text-center text-green-700">
                📊 Monthly Purchase Cost
              </h2>
              <div style={{ height: "300px" }}>
                <Bar data={getMonthlyCostData()} options={barOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Purchases;
