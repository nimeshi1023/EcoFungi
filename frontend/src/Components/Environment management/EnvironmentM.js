import React, { useState } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Emonitoring from '../Monitoring Section/Emonitoring';
import Acontrol from '../Automatic Control/Acontrol';
import Mcontrol from '../Manual Control/Mcontrol';
import EnvironmentH from '../EnvironmentHistory/EnvironmentH';

function EnvironmentM({ temp, humidity, minTemp, maxTemp, dataHistory = [] }) {
    
    const [activeSection, setActiveSection] = useState('monitoring');
    const [temperatureLevel, setTemperatureLevel] = useState(30); // max temperature
    const [autoSpray, setAutoSpray] = useState(false);
    const [currentTemp, setCurrentTemp] = useState(null);

    const handleSidebarClick = (section) => {
        setActiveSection(section);
    };

    // Animation variants for page transitions
    const pageVariants = {
        initial: {
            opacity: 0,
            x: -50,
        },
        in: {
            opacity: 1,
            x: 0,
        },
        out: {
            opacity: 0,
            x: 50,
        }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.4
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'monitoring':
                return (
                    <motion.div
                        key="monitoring"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Emonitoring 
                            temp={temp} 
                            humidity={humidity} 
                            minTemp={minTemp} 
                            maxTemp={maxTemp}
                            dataHistory={dataHistory}
                        />
                    </motion.div>
                );
            case 'automatic':
                return (
                    <motion.div
                        key="automatic"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Acontrol />
                    </motion.div>
                );
            case 'manual':
                return (
                    <motion.div
                        key="manual"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Mcontrol />
                    </motion.div>
                );
            case 'history':
                return (
                    <motion.div
                        key="history"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <EnvironmentH />
                    </motion.div>
                );
            default:
                return (
                    <motion.div
                        key="default"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Emonitoring 
                            temp={temp} 
                            humidity={humidity} 
                            minTemp={minTemp} 
                            maxTemp={maxTemp}
                            dataHistory={dataHistory}
                        />
                    </motion.div>
                );
        }
    };

    const [relayStatus, setRelayStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const getRelayStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/iot/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRelayStatus(response.data.message);
        } catch (error) {
            console.error('Error fetching relay status:', error);
        }
    };

    useEffect(() => {
        getRelayStatus(); // Initial fetch
        const interval = setInterval(getRelayStatus, 3000); // Poll every 3 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        getRelayStatus();
    }, []);

    const controlRelay = async (status) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/iot/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRelayStatus(response.data.message); // Update the relay status
        } catch (error) {
            console.error('Error controlling relay:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/temperatureSetting', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.data) {
                    setTemperatureLevel(res.data.data.maxTemp);
                    setAutoSpray(res.data.data.autoMode);
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const fetchLiveData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/iot/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.data) {
                    setCurrentTemp(res.data.data.temperature);
                }
            } catch (err) {
                console.error('Failed to fetch live data:', err);
            }
        };
        fetchLiveData(); // initial fetch
        const interval = setInterval(fetchLiveData, 5000); // every 5 sec
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!autoSpray || currentTemp === null || temperatureLevel === null) return;

        const controlRelay = async () => {
            if (currentTemp >= temperatureLevel) {
                try {
                    await axios.get(`http://localhost:5000/iot/sprayOn`);
                    await axios.get(`http://localhost:5000/iot/buzzerOn`);
                } catch (error) {
                    console.error('Error controlling relay:', error);
                }
            } else {
                try {
                    await axios.get(`http://localhost:5000/iot/sprayOff`);
                    await axios.get(`http://localhost:5000/iot/buzzerOff`);
                } catch (error) {
                    console.error('Error controlling relay:', error);
                }
            }
        };

        controlRelay(); // initial call

    }, [currentTemp, temperatureLevel, autoSpray]);

   

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
  <Header  />

  <div className="flex">
    {/* Left Sidebar */}
    <div className="w-64 bg-green-900 text-white fixed h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Environment Management
        </h2>

        {/* Sidebar Navigation Items */}
        <nav className="space-y-2">
          {/* Monitoring */}
          <button
            onClick={() => handleSidebarClick("monitoring")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
              activeSection === "monitoring"
                ? "bg-green-700"
                : "hover:bg-green-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection === "monitoring" ? "bg-green-600" : "bg-green-500"
              }`}
            >
              📊
            </div>
            <span className="font-medium">Environment Monitoring</span>
          </button>

          {/* Automatic */}
          <button
            onClick={() => handleSidebarClick("automatic")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
              activeSection === "automatic"
                ? "bg-green-700"
                : "hover:bg-green-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection === "automatic" ? "bg-green-600" : "bg-green-500"
              }`}
            >
              ⚙️
            </div>
            <span className="font-medium">Automatic Control</span>
          </button>

          {/* Manual */}
          <button
            onClick={() => handleSidebarClick("manual")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
              activeSection === "manual" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection === "manual" ? "bg-green-600" : "bg-green-500"
              }`}
            >
              🎛️
            </div>
            <span className="font-medium">Manual Control</span>
          </button>

          {/* History */}
          <button
            onClick={() => handleSidebarClick("history")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
              activeSection === "history"
                ? "bg-green-700"
                : "hover:bg-green-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection === "history" ? "bg-green-600" : "bg-green-500"
              }`}
            >
              📜
            </div>
            <span className="font-medium">Environment History</span>
          </button>
        </nav>

        {/* Relay Status */}
        <div className="mt-8 bg-green-800 rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold mb-3">
            Relay Status:{" "}
            <span className="font-bold">
              {loading ? "Loading..." : relayStatus}
            </span>
          </h2>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => controlRelay("sprayOn")}
              disabled={loading}
              className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm disabled:opacity-50"
            >
              Turn ON
            </button>
            <button
              onClick={() => controlRelay("sprayOff")}
              disabled={loading}
              className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm disabled:opacity-50"
            >
              Turn OFF
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Right Content Area with AnimatePresence */}
    <div className="flex-1 p-8 ml-64">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  </div>
</div>

    );
}

export default EnvironmentM;