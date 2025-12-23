import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png";

function SalarySlip() {
  const { id } = useParams();
  const [salary, setSalary] = useState(null);
  const slipRef = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/salaries/${id}`)
      .then((res) => setSalary(res.data.salary))
      .catch((err) => console.error("Error fetching salary slip:", err));
  }, [id]);

  // 🔹 Download PDF
  const handleDownloadPDF = async () => {
    const element = slipRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Salary_Slip_${salary?.employee_id || "Employee"}.pdf`);
  };

  if (!salary) {
    return <p className="text-center text-gray-600">Loading salary slip...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => window.print()}
          className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition"
        >
          🖨️ Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          ⬇️ Download PDF
        </button>
      </div>

      {/* Salary Slip */}
      <div
        ref={slipRef}
        className="bg-white shadow-xl rounded-lg w-full max-w-4xl border border-gray-300"
      >
        {/* Header */}
        <div className="bg-green-700 text-white p-6 rounded-t-lg flex justify-between items-center">
          {/* Left side: logo + company info */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="w-16 h-16 rounded-full border-2 border-white mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold">EcoFungi Pvt Ltd</h1>
              <p className="text-sm">Habaraduwa, Galle</p>
              <p className="text-sm">Tel: +94 77 974 5000</p>
            </div>
          </div>

          {/* Right side: title + date */}
          <div className="text-right">
            <h2 className="text-xl font-semibold">Salary Slip</h2>
            <p>
              {salary.month} {new Date(salary.createdAt).getFullYear()}
            </p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="p-6 grid grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Employee ID:</strong> {salary.employee_id}
          </p>
          <p>
            <strong>Name:</strong> {salary.name}
          </p>
          <p>
            <strong>Designation:</strong> {salary.designation}
          </p>
          <p>
            <strong>Date Issued:</strong>{" "}
            {new Date(salary.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Salary Details */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="font-semibold text-green-700 border-b pb-1 mb-2">
                Earnings
              </h3>
              <table className="w-full text-sm border">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Basic Salary</td>
                    <td className="p-2 text-right">
                      Rs {salary.basicSalary?.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Overtime</td>
                    <td className="p-2 text-right">
                      Rs {salary.overtime?.pay?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Bonus</td>
                    <td className="p-2 text-right">
                      Rs {salary.bonus?.amount?.toLocaleString() || 0}
                    </td>
                  </tr>
                  {salary.allowances?.map((a, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{a.name}</td>
                      <td className="p-2 text-right">
                        Rs {a.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="p-2">Total Earnings</td>
                    <td className="p-2 text-right">
                      Rs{" "}
                      {(
                        salary.basicSalary +
                        (salary.overtime?.pay || 0) +
                        (salary.bonus?.amount || 0) +
                        (salary.totals?.totalAllowances || 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-semibold text-red-700 border-b pb-1 mb-2">
                Deductions
              </h3>
              <table className="w-full text-sm border">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">No Pay</td>
                    <td className="p-2 text-right">
                      Rs {salary.deductions?.noPay?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">EPF</td>
                    <td className="p-2 text-right">
                      Rs {salary.deductions?.epf?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">APIT</td>
                    <td className="p-2 text-right">
                      Rs {salary.deductions?.apit?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Other</td>
                    <td className="p-2 text-right">
                      Rs {salary.deductions?.other?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="p-2">Total Deductions</td>
                    <td className="p-2 text-right">
                      Rs {salary.totals?.totalDeductions?.toLocaleString() || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Salary */}
          <div className="mt-6 text-center bg-green-50 border border-green-300 rounded-lg py-4">
            <h2 className="text-lg font-bold text-green-800">
              Net Salary: Rs {salary.totals?.netSalary?.toLocaleString() || 0}
            </h2>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between text-sm border-t border-gray-300">
          <p>
            <strong>Prepared By:</strong> Finance Department
          </p>
          <p>
            <strong>Authorized Signature:</strong> __________
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalarySlip;
