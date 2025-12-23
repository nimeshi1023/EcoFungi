import React, { useEffect, useState } from "react";
import InventoryNav from "../InventoryNav/InventoryNav";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/items";

function IntReport() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  useEffect(() => {
    axios.get(URL).then((res) => {
      setItems(res.data.items || []);
      setFilteredItems(res.data.items || []);
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // Filtering logic
  useEffect(() => {
    let result = [...items];

    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      result = result.filter((item) => {
        const date = new Date(item.Received_date);
        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() + 1 === parseInt(month)
        );
      });
    }

    if (searchQuery.trim()) {
  const trimmed = searchQuery.trim().toLowerCase();

  result = result.filter(
    (item) =>
      (item.Item_code &&
        item.Item_code.toString().toLowerCase().includes(trimmed)) ||
      (item.Item_name &&
        item.Item_name.toString().toLowerCase().startsWith(trimmed))
  );
}



    setFilteredItems(result);
  }, [selectedMonth, searchQuery, items]);

  const lowStockItems = filteredItems.filter((item) => item.Quantity < item.Reorder_level);
  const expiringItems = filteredItems.filter((item) => {
    const expDate = new Date(item.Expired_date);
    return expDate >= today && expDate <= nextWeek;
  });

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const reportPeriod = filteredItems.length
      ? `${formatDate(filteredItems[0].Received_date)} - ${formatDate(filteredItems[filteredItems.length - 1].Received_date)}`
      : "N/A";

    // HEADER
   const logoBase64 = "logo.png"; 

  const addHeader = () => {
    const headerHeight = 60;

    
    doc.setFillColor(20, 83, 45);
    doc.rect(margin, 20, pageWidth - 2 * margin, headerHeight, "F");

    
doc.addImage(logoBase64, "PNG", margin + 5, 35, 35, 35); 

const textY = 50; 


doc.setFontSize(16);
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.text("EcoFungi", margin + 50, textY);


doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text("Inventory Management System", margin + 50, textY + 15);

      
      doc.setFontSize(10);
      doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, pageWidth - margin - 180, 50);

      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20,83,45);
      doc.text("Inventory Movement Report", margin, 110);

      
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(margin, 120, pageWidth - margin, 120);

      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Records: ${filteredItems.length}`, margin, 135);
      doc.text(`Report Period: ${reportPeriod}`, margin, 150);

      
      doc.setDrawColor(20, 83, 45);
      doc.setLineWidth(1);
      doc.rect(margin - 5, 15, pageWidth - 2 * margin + 10, pageHeight - 30);
    };

    // FOOTER
    const addFooter = (pageNumber) => {
      const footerY = pageHeight - 35;

      // Horizontal line above footer
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 15, pageWidth - margin, footerY - 15);

      doc.setFontSize(8);
      doc.setTextColor(90);
      doc.text(
        "Note: This report contains inventory records collected by the EcoFungi system.",
        margin,
        footerY
      );
      doc.text("For questions or concerns, please contact the system administrator.", margin, footerY + 10);

      doc.text(`Page ${pageNumber}`, pageWidth - margin - 30, footerY + 10);
    };

    addHeader();

    let yPosition = 180;

    // Dynamic tables with evenly spaced columns
    const drawTable = (columns, data, title) => {
      doc.setFontSize(11);
      doc.setTextColor(20, 83, 45);
      doc.text(title, margin, yPosition - 10);

      autoTable(doc, {
        head: [columns],
        body: data.length ? data : [["No data available", ...Array(columns.length - 1).fill("")]],
        startY: yPosition,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          halign: "center",
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [20, 83, 45],
          textColor: 255,
          fontStyle: "bold",
        },
        // 👇 Even column widths
        columnStyles: Object.fromEntries(columns.map((_, i) => [i, { cellWidth: "auto" }])),
        didDrawPage: () => {
          const pageNumber = doc.internal.getNumberOfPages();
          addHeader();
          addFooter(pageNumber);
        },
      });
      yPosition = doc.lastAutoTable.finalY + 30;
    };

    // Main Inventory Table
    drawTable(
      [
        "Item Code",
        "Category",
        "Item Name",
        "Quantity",
        "Unit",
        "Received Date",
        "Expired Date",
        "Reorder Level",
        "Description",
        "Purchase ID",
      ],
      filteredItems.map((item) => [
        item.Item_code,
        item.Category,
        item.Item_name,
        item.Quantity,
        item.Unit,
        formatDate(item.Received_date),
        formatDate(item.Expired_date),
        item.Reorder_level,
        item.Description,
        item.Purchase_id,
      ]),
      "Inventory Overview"
    );

    // Low Stock Table
    drawTable(
      ["Item Code", "Item Name", "Quantity", "Reorder Level"],
      lowStockItems.map((item) => [
        item.Item_code,
        item.Item_name,
        item.Quantity,
        item.Reorder_level,
      ]),
      "Low Stock Items"
    );

    // Expiring Items Table
    drawTable(
      ["Item Code", "Item Name", "Quantity", "Expired Date"],
      expiringItems.map((item) => [
        item.Item_code,
        item.Item_name,
        item.Quantity,
        formatDate(item.Expired_date),
      ]),
      "Expiring Items (Next 7 Days)"
    );

    doc.save(`Inventory_Movement_Report_${now.toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      <InventoryNav />
      <div className="ml-52 flex-1 p-6 space-y-8 overflow-auto">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by Item Code or Item Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={generatePDF}
            className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 shadow-md transition-all"
          >
            📄 Download Report
          </button>
        </div>

        {/* Inventory Overview Table */}
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Inventory Overview</h2>
          <table className="min-w-full border border-green-300 text-left text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                {[
                  "Item Code",
                  "Category",
                  "Item Name",
                  "Quantity",
                  "Unit",
                  "Received Date",
                  "Expired Date",
                  "Reorder Level",
                  "Description",
                  "Purchase ID",
                ].map((h, idx) => (
                  <th key={idx} className="px-3 py-2 border-r last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => (
                <tr key={i} className="border-t hover:bg-green-50">
                  <td className="px-3 py-2">{item.Item_code}</td>
                  <td className="px-3 py-2">{item.Category}</td>
                  <td className="px-3 py-2">{item.Item_name}</td>
                  <td className="px-3 py-2">{item.Quantity}</td>
                  <td className="px-3 py-2">{item.Unit}</td>
                  <td className="px-3 py-2">{formatDate(item.Received_date)}</td>
                  <td className="px-3 py-2">{formatDate(item.Expired_date)}</td>
                  <td className="px-3 py-2">{item.Reorder_level}</td>
                  <td className="px-3 py-2">{item.Description}</td>
                  <td className="px-3 py-2">{item.Purchase_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IntReport;
