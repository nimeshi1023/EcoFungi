import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';

function Acontrol() {
  const [temperatureLevel, setTemperatureLevel] = useState(30); // max temperature
  const [autoSpray, setAutoSpray] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(null);

  // Save max temp + auto spray to DB on button click
  const saveSettings = async () => {
    const temp = parseFloat(temperatureLevel);
    if (isNaN(temp) || temp < 20 || temp > 35) {
      alert('Should add only 20-35 this range number');
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:5000/api/temperatureSetting',
        {
          maxTemp: temp,
          autoMode: autoSpray,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.data && res.data.message) {
        alert(res.data.message);
      } else {
        alert('Settings saved!');
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  };

  // Load existing settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/temperatureSetting', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  // Handle live data fetch
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/iot/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  // Relay control logic - poll every 5 seconds
  useEffect(() => {
    if (!autoSpray || currentTemp === null || temperatureLevel === null) return;

    const controlRelay = async () => {
      if (currentTemp >= temperatureLevel) {
        try {
          await axios.get('http://localhost:5000/iot/sprayOn', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          await axios.get('http://localhost:5000/iot/buzzerOn', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        } catch (error) {
          console.error('Error controlling relay:', error);
        }
      } else {
        try {
          await axios.get('http://localhost:5000/iot/sprayOff', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          await axios.get('http://localhost:5000/iot/buzzerOff', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        } catch (error) {
          console.error('Error controlling relay:', error);
        }
      }
    };

    controlRelay(); // initial call
    const interval = setInterval(controlRelay, 5000); // poll every 5 seconds
    return () => clearInterval(interval);
  }, [currentTemp, temperatureLevel, autoSpray]);

  return (
    <div>
    

      {/* Set Automatic Water Spray */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-green-600">🤖</span>
          Set Automatic Water Spray
        </h2>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Max Temperature */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Max Temperature (°C)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="35"
                  value={temperatureLevel}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseFloat(val) >= 20 && parseFloat(val) <= 35)) {
                      setTemperatureLevel(val);
                    } else {
                      alert('Should add only 20-35 this range number');
                    }
                  }}
                  placeholder="e.g. 30"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm pr-12"
                />
                <span className="absolute right-3 top-3 text-gray-500 font-medium">°C</span>
              </div>
            </div>

            {/* Auto Spray Toggle */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Auto Spray:</span>
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoSpray}
                    onChange={(e) => setAutoSpray(e.target.checked)}
                  />
                  <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600 transition-all duration-300 shadow-inner"></div>
                  <div className="absolute w-6 h-6 bg-white rounded-full shadow-lg left-0.5 top-0.5 peer-checked:translate-x-7 transform transition-transform duration-300 border border-gray-200"></div>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    autoSpray ? 'bg-green-500' : 'bg-gray-400'
                  } animate-pulse`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    autoSpray ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {autoSpray ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Set Button */}
          <div className="mt-4">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              Set
            </button>
          </div>
        </div>
      </div>

      {/* Live Temperature Display */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-700 font-medium">
          Current Temperature: {currentTemp ? `${currentTemp} °C` : 'Loading...'}
        </p>
        <p className="text-gray-700 font-medium">Max Temperature Set: {temperatureLevel} °C</p>
      </div>
    </div>
  );
}

export default Acontrol;
