import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PurchaseNav from "../PurchaseNav/PurchaseNav";

const URL = "http://localhost:5000/purchases";

function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data.purchases || [];
        setPurchases(data);
        setFilteredPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    fetchPurchases();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredPurchases(purchases);
      return;
    }
    const filtered = purchases.filter(
      (p) =>
        (p.Purchase_id ?? "")
          .toString()
          .toLowerCase()
          .includes(query) ||
        (p.Item_name ?? "").toLowerCase().startsWith(query)
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);

 const generatePDF = () => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40; // main border margin
  const headerInset = 10; // header inside border

  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const logoBase64 = "logo.png"; // replace with your actual base64 logo

  // 1️⃣ Draw border
  doc.setDrawColor(20, 83, 45);
  doc.setLineWidth(1);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

  // 2️⃣ Header inside border
  const headerHeight = 60;
  const headerX = margin + headerInset;
  const headerY = margin + headerInset;
  const headerWidth = pageWidth - 2 * (margin + headerInset);

  // Green rectangle
  doc.setFillColor(20, 83, 45);
  doc.rect(headerX, headerY, headerWidth, headerHeight, "F");

  // Logo
  const logoSize = 35;
  const logoX = headerX + 10;
  const logoY = headerY + (headerHeight - logoSize) / 2;
  doc.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);

  // Text
  const textX = logoX + logoSize + 10;
  const textCenterY = headerY + headerHeight / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("EcoFungi", textX, textCenterY - 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Inventory Management System", textX, textCenterY + 12);

  // Date/time (right)
  const dateText = `Generated on: ${formattedDate} at ${formattedTime}`;
  doc.setFontSize(10);
  doc.text(dateText, headerX + headerWidth - doc.getTextWidth(dateText) - 10, textCenterY + 4);

  // 3️⃣ Report Title below header
  const titleY = headerY + headerHeight + 20; // leave some spacing
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text("Purchase Report", margin + 10, titleY);

  // Line under title
  doc.setDrawColor(100);
  doc.setLineWidth(0.5);
  doc.line(margin + 10, titleY + 3, pageWidth - margin - 10, titleY + 3);

  // Info
  const fromDate = purchases[0]?.Purchase_date
    ? new Date(purchases[0].Purchase_date).toLocaleDateString()
    : "N/A";
  const toDate = purchases[purchases.length - 1]?.Purchase_date
    ? new Date(purchases[purchases.length - 1].Purchase_date).toLocaleDateString()
    : "N/A";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Total Records: ${filteredPurchases.length}`, margin + 10, titleY + 15);
  doc.text(`Report Period: ${fromDate} - ${toDate}`, margin + 10, titleY + 30);

  // 4️⃣ Table
  const tableColumns = ["Purchase ID", "Supplier ID", "Item Name", "Purchase Date", "Price"];
  const tableRows = filteredPurchases.map((p) => [
    p.Purchase_id,
    p.Supplier_id,
    p.Item_name,
    new Date(p.Purchase_date).toLocaleDateString(),
    `Rs.${p.Price}`,
  ]);

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: titleY + 45,
    theme: "grid",
    headStyles: {
      fillColor: [20, 83, 45],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
      fontSize: 9,
    },
    margin: { left: margin + 10, right: margin + 10 },
  });

  // 5️⃣ Notes
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(
    "Note: This report contains purchase records collected by the EcoFungi system.",
    margin + 10,
    finalY
  );
  doc.text("For questions or concerns, please contact the system administrator.", margin + 10, finalY + 12);

  // 6️⃣ Footer
  const footerY = pageHeight - margin - 10;
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin + 10, footerY - 5, pageWidth - margin - 10, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text("EcoFungi Inventory Management System", margin + 10, footerY);
  const pageText = `Page 1 of ${doc.internal.getNumberOfPages()}`;
  doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), footerY);

  doc.save(`EcoFungi_Purchase_Report_${now.toISOString().split("T")[0]}.pdf`);
};

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <PurchaseNav />
      </div>
      <div className="ml-[200px] flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart /> Purchase Report
          </h1>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <FaFilePdf /> Download Report
          </button>
        </div>

        <input
          type="text"
          placeholder="Search purchases by Item or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-md print:hidden"
        />

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-300 p-6 mt-4">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Purchase ID</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Supplier ID</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Item Name</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Purchase Date</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p) => (
                  <tr key={p._id} className="hover:bg-green-50">
                    <td className="px-4 py-3 border-b border-gray-300">{p.Purchase_id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{p.Supplier_id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{p.Item_name}</td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {new Date(p.Purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">Rs.{p.Price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No purchases found.
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

export default PurchaseReport;
