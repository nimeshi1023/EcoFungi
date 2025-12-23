import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../fNav/fNav";
import Header from "../Header/Header";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ProfitLossDashboard() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pieMonth, setPieMonth] = useState("all");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/expenses")
      .then((res) => setExpenses(res.data.expenses || []))
      .catch((err) => console.error("Expenses fetch error:", err));
  }, []);

  const handleGenerate = async () => {
    if (!month || !year) return alert("Please select month and year");
    setLoading(true);
    try {
      const resPL = await axios.post("http://localhost:5000/profits/generate", {
        month: Number(month),
        year: Number(year),
      });
      setResult(resPL.data.pl);

      const resExp = await axios.get("http://localhost:5000/expenses", {
        params: { month: Number(month), year: Number(year) },
      });
      setExpenses(resExp.data.expenses || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const cardColors = {
    green: "border-green-500 text-green-700",
    red: "border-red-500 text-red-700",
  };

  const cards = result
    ? [
        {
          label: "Total Revenue",
          value: result.revenue.totalRevenue.toFixed(2),
          icon: "💰",
          color: "green",
        },
        {
          label: "Total Expenses",
          value: (result.expenses.expenses + result.expenses.salaries).toFixed(2),
          icon: "💸",
          color: "red",
        },
        {
          label: result.netProfit >= 0 ? "Net Profit" : "Net Loss",
          value: Math.abs(result.netProfit).toFixed(2),
          icon: result.netProfit >= 0 ? "📈" : "📉",
          color: result.netProfit >= 0 ? "green" : "red",
        },
      ]
    : [];

  const filteredExpenses =
    pieMonth === "all"
      ? expenses
      : expenses.filter((exp) => new Date(exp.date).getMonth() === Number(pieMonth));

  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    acc[cat] = (acc[cat] || 0) + (exp.amount || 0);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#F87171", "#34D399", "#60A5FA", "#FBBF24",
          "#A78BFA", "#F472B6", "#FCD34D", "#4ADE80"
        ],
        borderWidth: 1,
      },
    ],
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ✅ Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full w-52 bg-green-900 text-white shadow-lg z-20">
        <Nav />
      </div>

      {/* ✅ Fixed Header */}
      <div className="fixed top-0 left-52 right-0 z-10 bg-white shadow-sm">
        <Header />
      </div>

      {/* ✅ Main Content */}
      <main className="flex-1 ml-52 p-6 pt-20 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-4">
          📊 Finance Dashboard
        </h1>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400"
          >
            <option value="">-- Month --</option>
            {months.map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "..." : "View"}
          </button>
        </div>

        {/* Cards */}
        {result && (
          <div className="flex flex-wrap justify-center w-full max-w-6xl gap-4">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`flex-1 min-w-[200px] flex justify-between items-center p-4 rounded-lg shadow-md bg-white border-l-4 ${cardColors[card.color]}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{card.label}</span>
                  <span className="text-xl font-bold mt-1">Rs {card.value}</span>
                  <span className="text-gray-500 mt-0.5 text-xs">
                    {month && year
                      ? `${months[month - 1]} ${year}`
                      : "All Time"}
                  </span>
                </div>
                <div className="text-3xl">{card.icon}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pie Chart & Recent Expenses */}
        {expenses.length > 0 && (
          <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-4 mt-4">
            {/* Pie Chart */}
            <div className="flex-1 p-4 bg-white shadow-md rounded-lg border border-red-200 flex flex-col" style={{ minHeight: "250px" }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-red-700">Expenses by Category</h3>
                <select
                  value={pieMonth}
                  onChange={(e) => setPieMonth(e.target.value)}
                  className="p-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400"
                >
                  <option value="all">All Time</option>
                  {months.map((m, idx) => (
                    <option key={idx} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <Pie data={pieData} />
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="flex-1 p-4 bg-white shadow-md rounded-lg border border-gray-200 flex flex-col" style={{ minHeight: "250px" }}>
              <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2 border-b pb-1">
                <span className="text-green-600 text-lg">💵</span> Recent Expenses
              </h3>

              {recentExpenses.length === 0 ? (
                <p className="text-gray-500 text-center text-sm">No expenses</p>
              ) : (
                <ul className="space-y-2 flex-1 overflow-y-auto pr-1">
                  {recentExpenses.map((exp, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-md border border-gray-100 bg-gray-50 hover:bg-gray-100 shadow-sm transition flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full w-fit mb-1 bg-gray-200 text-gray-800">
                          {exp.category || "Other"}
                        </span>
                        <p className="text-gray-800 font-medium text-sm">
                          {exp.description || "No description"}
                        </p>
                        <span className="text-gray-500 text-xs">
                          {new Date(exp.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">
                          - Rs {exp.amount.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfitLossDashboard;
