import React, { useState, useEffect } from 'react';
import LineChart from '../Line Chart/LineChart'; // Make sure path is correct
import axios from 'axios';

function Emonitoring() {
  const [iotData, setIotData] = useState({
    temperature: null,
    humidity: null,
    minTemp: null,
    maxTemp: null,
    minHumidity: null,
    maxHumidity: null,
    timestamp: null,
    offline: false // Initialize offline status
  });

  const [iotLoading, setIotLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ✅ Fetch IoT data
  useEffect(() => {
    const fetchIoTData = async () => {
      try {
        setIotLoading(true);
        console.log("🔄 Fetching IoT data from /iot/stats...");

        const response = await axios.get("http://localhost:5000/iot/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log("📡 IoT API Response:", response.data);

        if (response.data && response.data.data) {
          const data = response.data.data;

          // Ensure offline status is correctly handled
          setIotData({
            temperature: data.temperature,
            humidity: data.humidity,
            minTemp: data.minTemp,
            maxTemp: data.maxTemp,
            minHumidity: data.minHumidity,
            maxHumidity: data.maxHumidity,
            timestamp: data.timestamp,
            offline: data.offline || false // ✅ use backend flag
          });
          setLastUpdate(new Date());
          console.log("✅ IoT data updated successfully");
        } else {
          console.error("❌ Invalid API response:", response.data);
          setIotData(prev => ({ ...prev, offline: true })); // Mark as offline if invalid response
        }
      } catch (error) {
        console.error("❌ Failed to fetch IoT data:", error);
        setIotData(prev => ({ ...prev, offline: true }));  // Mark as offline if error occurs
      } finally {
        setIotLoading(false);
      }
    };

    fetchIoTData();
    const intervalId = setInterval(fetchIoTData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // ✅ Helpers
  const formatTemperature = (value) => {
    if (iotLoading) return "Loading...";
    if (value !== null && typeof value === 'number') {
      return `${value.toFixed(2)} °C`;
    }
    return "—";
  };

  const formatHumidity = (value) => {
    if (iotLoading) return "Loading...";
    if (value !== null && typeof value === 'number') {
      return `${value.toFixed(2)}%`;
    }
    return "—";
  };

  // ✅ Manual refresh
  const handleManualRefresh = async () => {
    try {
      setIotLoading(true);
      const response = await axios.get("http://localhost:5000/iot/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.data) {
        const data = response.data.data;
        setIotData({
          temperature: data.temperature,
          humidity: data.humidity,
          minTemp: data.minTemp,
          maxTemp: data.maxTemp,
          minHumidity: data.minHumidity,
          maxHumidity: data.maxHumidity,
          timestamp: data.timestamp,
          offline: data.offline || false
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Manual refresh failed:', error);
      setIotData(prev => ({ ...prev, offline: true }));  // Mark as offline if error occurs
    } finally {
      setIotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 mb-12 border border-gray-100">
        
        {/* Temp & Humidity Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
            <span className="text-green-600">🌱</span>
            Plantation Conditions
          </h2>

          {/* ✅ Offline + Loading Alerts */}
          {iotData.offline && (
            <div className="mb-4 p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-center font-medium">
              ⚠️ IoT Device Offline – showing last available data
            </div>
          )}
          {iotLoading && (
            <div className="mb-4 text-center text-gray-600 animate-pulse">
              ⏳ Fetching live IoT data...
            </div>
          )}

          {/* Real-time update indicator */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Data</span>
              <span className="text-xs text-gray-500">
                Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}
              </span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="ml-4 px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌡️</span>
                <div>
                  <p className="text-sm text-gray-600">Plantain Temperature</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatTemperature(iotData.temperature)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="text-sm text-gray-600">Plantain Humidity</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatHumidity(iotData.humidity)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Min/Max Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">🔥</span>
                <p className="text-red-700 font-medium">Max Temp</p>
              </div>
              <p className="text-xl font-bold text-red-600">{formatTemperature(iotData.maxTemp)}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">💦</span>
                <p className="text-blue-700 font-medium">Max Humidity</p>
              </div>
              <p className="text-xl font-bold text-blue-600">{formatHumidity(iotData.maxHumidity)}</p>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">❄️</span>
                <p className="text-cyan-700 font-medium">Min Temp</p>
              </div>
              <p className="text-xl font-bold text-cyan-600">{formatTemperature(iotData.minTemp)}</p>
            </div>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">💧</span>
                <p className="text-teal-700 font-medium">Min Humidity</p>
              </div>
              <p className="text-xl font-bold text-teal-600">{formatHumidity(iotData.minHumidity)}</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 shadow-inner mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Environmental Monitoring
            </h3>

            <div className="flex justify-center gap-8 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                <span className="font-medium text-gray-700">Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                <span className="font-medium text-gray-700">Humidity</span>
              </div>
            </div>

            <LineChart temp={iotData.temperature} humidity={iotData.humidity} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emonitoring;
