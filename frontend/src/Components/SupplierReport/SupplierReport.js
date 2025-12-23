import React, { useEffect, useState } from "react";
import SupplyNav from "../SupplyNav/SupplyNav";
import axios from "axios";
import { FaTruck, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/suppliers";

function SupplierReport() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data.suppliers || res.data || [];
        setSuppliers(data);
        setFilteredSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Auto-filter suppliers by search
  useEffect(() => {
  const trimmedQuery = searchQuery.trim().toLowerCase();

  if (!trimmedQuery) {
    setFilteredSuppliers(suppliers);
    return;
  }

  const filtered = suppliers.filter(
    (sup) =>
      sup.Supplier_id?.toString().toLowerCase().includes(trimmedQuery) ||
      sup.Supplier_name?.toLowerCase().startsWith(trimmedQuery)
  );

  setFilteredSuppliers(filtered);
}, [searchQuery, suppliers]);


const generatePDF = () => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Your logo in base64
  const logoBase64 = "logo.png"; 

  const addHeader = () => {
    const headerHeight = 60;

    // Green rectangle
    doc.setFillColor(20, 83, 45);
    doc.rect(margin, 20, pageWidth - 2 * margin, headerHeight, "F");

    // Logo on left
   // Place logo slightly lower and aligned with text
doc.addImage(logoBase64, "PNG", margin + 5, 35, 35, 35); 
// X = margin + 5, Y = 35, Width = 35, Height = 35

// Company name next to logo (aligned to same row)
const textY = 50; // same vertical center as the logo

// "EcoFungi" - bold and large
doc.setFontSize(16);
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.text("EcoFungi", margin + 50, textY);

// Subtitle - below main title but still aligned with logo
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text("Inventory Management System", margin + 50, textY + 15);


    // Right: Date & time
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, pageWidth - margin - 180, 50);

    // Report title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20,83,45);
    doc.text("Supplier Report", margin, 110);

    // Line below title
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, 120, pageWidth - margin, 120);

    // Total records
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Suppliers: ${filteredSuppliers.length}`, margin, 135);

    // Border around the page
    doc.setDrawColor(20, 83, 45);
    doc.setLineWidth(2);
    doc.rect(margin - 5, 15, pageWidth - 2 * margin + 10, pageHeight - 30);
  };

  const addFooter = (pageNumber) => {
    const footerY = pageHeight - 35;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 15, pageWidth - margin, footerY - 15);

    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text(
      "Note: This report contains supplier records managed by the EcoFungi system.",
      margin,
      footerY
    );
    doc.text("For inquiries, please contact the system administrator.", margin, footerY + 10);

    doc.text(`Page ${pageNumber}`, pageWidth - margin - 30, footerY + 10);
  };

  addHeader();

  autoTable(doc, {
    startY: 160,
    head: [["Supplier ID", "Supplier Name", "Contact Number", "Email", "Address"]],
    body: filteredSuppliers.length
      ? filteredSuppliers.map((sup) => [
          sup.Supplier_id,
          sup.Supplier_name,
          sup.Phone_number,
          sup.Email,
          sup.Address,
        ])
      : [["No data available", "", "", "", ""]],
    styles: { fontSize: 9, halign: "center" },
    headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: "bold" },
    didDrawPage: (data) => {
      const pageNumber = doc.internal.getNumberOfPages();
      addHeader();
      addFooter(pageNumber);
    },
    margin: { left: margin, right: margin },
  });

  doc.save(`Supplier_Report_${now.toISOString().split("T")[0]}.pdf`);
};

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <SupplyNav />
      </div>

      {/* Main content */}
      <div className="ml-[200px] flex-1 p-6 space-y-6 overflow-auto">
        {/* Header & PDF */}
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTruck /> Supplier Report
          </h1>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md shadow-md"
          >
            <FaFilePdf /> Download Report
          </button>
        </div>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search by Supplier ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-md print:hidden"
        />

        {/* No results */}
        {filteredSuppliers.length === 0 && (
          <p className="text-red-500 font-bold mt-4">No suppliers found</p>
        )}

        {/* Supplier Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-300 p-6 mt-4">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Supplier List</h2>
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 border-b text-left">Supplier ID</th>
                <th className="px-4 py-3 border-b text-left">Supplier Name</th>
                <th className="px-4 py-3 border-b text-left">Contact Number</th>
                <th className="px-4 py-3 border-b text-left">Email</th>
                <th className="px-4 py-3 border-b text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((sup) => (
                  <tr key={sup._id} className="hover:bg-green-50">
                    <td className="px-4 py-3 border-b">{sup.Supplier_id}</td>
                    <td className="px-4 py-3 border-b">{sup.Supplier_name}</td>
                    <td className="px-4 py-3 border-b">{sup.Phone_number}</td>
                    <td className="px-4 py-3 border-b">{sup.Email}</td>
                    <td className="px-4 py-3 border-b">{sup.Address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SupplierReport;
