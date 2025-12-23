import React, { useState, useEffect } from "react";
import axios from "axios";
import ExNav from "../ExNav/ExNav";
import Exp from "../Exp/Exp";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Replace this with your actual logo (base64)
import logo from "../../assets/logo.png"; 

const URL = "http://localhost:5000/expenses";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Exdetails() {
  const [expenses, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setExpense(data.expenses));
  }, []);

  // ✅ Search filter
  const searchedExpenses = expenses.filter((ex) =>
    searchId ? String(ex.expenseId).includes(searchId.trim()) : true
  );

  // ✅ Filter by month/category
  const filteredExpenses = expenses.filter((ex) => {
    const exDate = new Date(ex.date);
    const matchesMonth = selectedMonth
      ? `${exDate.getFullYear()}-${String(exDate.getMonth() + 1).padStart(2, "0")}` ===
        selectedMonth
      : true;
    const matchesCategory = selectedCategory
      ? ex.category === selectedCategory
      : true;
    return matchesMonth && matchesCategory;
  });

  // ✅ Total
  const totalExpense = filteredExpenses.reduce(
    (sum, ex) => sum + Number(ex.amount),
    0
  );

  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedCategory("");
  };

  // ✅ PDF DOWNLOAD (with logo and balanced layout)
  const handleDownloadPDF = () => {
    if (filteredExpenses.length === 0) {
      alert("No data to export for this filter.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // 🟢 Border
    doc.setDrawColor(20, 83, 45);
    doc.setLineWidth(2);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

    // 🟢 Header
    doc.setFillColor(20, 83, 45);
    doc.rect(margin + 3, margin + 3, pageWidth - (margin * 2) - 6, 30, "F");

    try {
    // Calculate header area height (30px high from your code)
    const headerHeight = 30;
    const logoSize = 18; // slightly larger for clarity
    const logoX = margin + 10;
    const logoY = margin + 3 + (headerHeight - logoSize) / 2; // vertically centered

    doc.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);
    } catch {
      // if logo fails to load, skip silently
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("EcoFungi Pvt Ltd", margin + 28, margin + 18);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Expense Monitoring Report", margin + 28, margin + 25);

    const reportDate = `Generated: ${new Date().toLocaleString()}`;
    const dateWidth = doc.getTextWidth(reportDate);
    doc.text(reportDate, pageWidth - margin - dateWidth - 5, margin + 18);

    // 🟢 Title
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Filtered Expense Report", margin + 5, margin + 50);
    doc.line(margin + 5, margin + 52, pageWidth - margin - 5, margin + 52);

    // 🟢 Filter Info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Filter: ${selectedMonth || "All Months"} | Category: ${
        selectedCategory || "All"
      }`,
      margin + 5,
      margin + 60
    );

    // 🧾 Table (balanced column widths)
    const tableData = filteredExpenses.map((ex) => [
      new Date(ex.date).toISOString().split("T")[0],
      ex.expenseId,
      ex.category,
      ex.description,
      ex.paymentMethod,
      `Rs. ${Number(ex.amount).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [
        [
          "Date",
          "Expense ID",
          "Category",
          "Description",
          "Payment",
          "Amount (Rs.)",
        ],
      ],
      body: tableData,
      startY: margin + 68,
      theme: "striped",
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 9,
      },
      headStyles: {
        fillColor: [20, 83, 45],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        halign: "center",
        cellPadding: 3,
      },
      margin: { left: margin + 5, right: margin + 5 },
      tableWidth: "auto",
    });

    // 🟢 Total
    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(20, 83, 45);
    doc.text(`Total Expense: Rs. ${totalExpense.toFixed(2)}`, margin + 10, finalY);

    // 🟢 Footer
    const footerY = pageHeight - margin - 18;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("EcoFungi Financial Monitoring System", margin + 10, footerY + 5);

    // ✅ Save File
    const fileName = `EcoFungi_Expense_Report_${
      selectedMonth || "All"
    }_${selectedCategory || "All"}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex">
      <ExNav />

      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52">
        <h1 className="text-2xl font-bold text-[#1B5E20] text-center mb-6">
          Expenses Details
        </h1>

        {/* 🔎 Search by Expense ID */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Expense ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>

        {/* All Expenses Table */}
        <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-10">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Expense ID</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Payment Method</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {searchedExpenses.length > 0 ? (
                searchedExpenses.map((ex, i) => (
                  <Exp
                    key={i}
                    ex={ex}
                    onDelete={(id) =>
                      setExpense((prev) => prev.filter((e) => e._id !== id))
                    }
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1B5E20] mb-4">
            Filter Expenses
          </h2>

          <div className="flex gap-4 mb-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-green-400 rounded p-2"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-green-400 rounded p-2"
            >
              <option value="">-- All Categories --</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance & Repairs">Maintenance & Repairs</option>
              <option value="Transportation">Transportation</option>
              <option value="Inventory">Inventory</option>
              <option value="Other">Other</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          </div>

          {/* Filtered Table + PDF */}
          {(selectedMonth || selectedCategory) && (
            <>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full border border-[#A5D6A7] rounded-lg">
                  <thead className="bg-[#388E3C] text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Expense ID</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Payment Method</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-green-200">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((ex, i) => (
                        <tr key={i} className="hover:bg-[#E8F5E9] transition">
                          <td className="px-4 py-2">
                            {new Date(ex.date).toISOString().split("T")[0]}
                          </td>
                          <td className="px-4 py-2">{ex.expenseId}</td>
                          <td className="px-4 py-2">{ex.category}</td>
                          <td className="px-4 py-2">{ex.description}</td>
                          <td className="px-4 py-2">{ex.paymentMethod}</td>
                          <td className="px-4 py-2">Rs. {ex.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-gray-500 py-4">
                          No expenses found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="font-semibold text-lg text-[#1B5E20]">
                  Total Expense: Rs. {totalExpense.toFixed(2)}
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-700 text-white px-5 py-2 rounded-lg shadow hover:bg-green-800 transition"
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Exdetails;
