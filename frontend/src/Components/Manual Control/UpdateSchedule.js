// src/components/Schedule/update.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header"; // ✅ your existing header

function UpdateSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    batchid: "",
    day: "every",
    stime: "",
    endtime: ""
  });
  const [batches, setBatches] = useState([]);
  const [activeSection, setActiveSection] = useState("manual");
  const [relayStatus, setRelayStatus] = useState("Unknown");
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch schedule ----------------
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/sprays/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.data && (res.data.spray || res.data)) {
          // some APIs return {spray: {...}}, some just the object
          setFormData(res.data.spray || res.data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      }
    };
    fetchSchedule();
  }, [id]);

  // ---------------- Fetch batches ----------------
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/batches", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBatches(res.data.batches || []);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    if (!formData.batchid || !formData.stime || !formData.endtime) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.endtime <= formData.stime) {
      alert("End time must be later than start time.");
      return;
    }

    const startDate = new Date(`1970-01-01T${formData.stime}:00`);
    const endDate = new Date(`1970-01-01T${formData.endtime}:00`);
    const diffMinutes = (endDate - startDate) / (1000 * 60);
    if (diffMinutes > 120) {
      alert("Spray duration cannot exceed 2 hours.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/sprays/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Schedule updated successfully!");
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
      } else {
        console.error("Failed to update:", err);
        alert("Update failed. See console.");
      }
    }
  };

  const handleSidebarClick = (section) => {
    setActiveSection(section);
    if (section === "environmentM") {
      navigate("/Environment_Manager-dashboard");
    }
  };

  const renderContent = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="text-green-600">✏️</span>
        Update Spray Schedule
      </h2>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Batch
          </label>
          <select
            name="batchid"
            value={formData.batchid}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          >
            <option value="">-- Select a Batch --</option>
            {Array.isArray(batches) &&
              batches.map((batch) => (
                <option key={batch._id} value={batch.batchid}>
                  Batch {batch.batchid} - {batch.status}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Day
          </label>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          >
            <option value="every">Every Day</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            name="stime"
            value={formData.stime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            name="endtime"
            value={formData.endtime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 shadow-md"
        >
          Update Schedule
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Fixed Header at the top */}
      <Header />

      {/* ✅ Sidebar + Content under header */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-green-600 shadow-lg text-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Environment Management
            </h2>

            <nav className="space-y-2">
              <button
                onClick={() => handleSidebarClick("environmentM")}
                className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 bg-green-500 hover:bg-green-700"
              >
                <span className="font-medium">🌍 Back to EnvironmentM</span>
              </button>

              <button
                onClick={() => handleSidebarClick("manual")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === "manual"
                    ? "bg-white text-green-700 border-l-4 border-green-500"
                    : "text-white hover:bg-green-500"
                }`}
              >
                <span className="font-medium">Manual Control</span>
              </button>
            </nav>

            <div className="mt-8 p-4 bg-green-700 rounded-lg">
              <h2>Relay Status: {loading ? "Loading..." : relayStatus}</h2>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </div>
  );
}

export default UpdateSchedule;
