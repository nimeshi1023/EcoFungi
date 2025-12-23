import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Mcontrol() {
  const [schedules, setSchedules] = useState([]); 
  const [formData, setFormData] = useState({
    day: 'every',
    start: '',
    end: ''
  });
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [endOptions, setEndOptions] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const schedulesRef = useRef(schedules);
  const [relayOn, setRelayOn] = useState(null); // track last relay state to avoid duplicate calls

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sprays", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(response.data.sprays); 
      } catch (error) {
        console.error("Failed to load schedules:", error);
      }
    };

    fetchSchedules();
    const intervalId = setInterval(fetchSchedules, 1000);
    return () => clearInterval(intervalId);
  }, [token]);

  // keep ref in sync without causing re-renders
  useEffect(() => {
    schedulesRef.current = schedules;
  }, [schedules]);

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/batches", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatches(res.data.batches);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setBatches([]);
      }
    };
    fetchBatches();
  }, [token]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // If start changed, we'll update end options and possibly reset end
    if (name === 'start') {
      setFormData({ ...formData, start: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Build end time options whenever start changes
  useEffect(() => {
    const buildEndOptions = () => {
      const start = formData.start;
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // helper to parse HH:MM
      const parseHM = (s) => {
        if (!s) return null;
        const p = s.split(':');
        if (p.length < 2) return null;
        const h = parseInt(p[0], 10);
        const m = parseInt(p[1], 10);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
      };

      const fmt = (mins) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };

      const options = [];
      // Determine base start minutes: use parsed start or now if start empty
      const startMinutes = parseHM(start) ?? nowMinutes;
      // end limit is start + 5 hours
      const endLimit = Math.min(startMinutes + 5 * 60, 23 * 60 + 59);
  // step in minutes (1 min for testing)
  const step = 1;

      for (let t = startMinutes; t <= endLimit; t += step) {
        // Do not include past times relative to now
        if (t < nowMinutes) continue;
        options.push(fmt(t));
      }

      setEndOptions(options);

      // If current selected end is not in options, reset it
      if (formData.end && !options.includes(formData.end)) {
        setFormData(prev => ({ ...prev, end: '' }));
      }
    };
    buildEndOptions();
    // Recompute when start or schedules change; schedules may not affect but keep stable
  }, [formData.start]);

  const handleAddSchedule = async () => {
    if (!selectedBatch) {
      alert("Please select a batch!");
      return;
    }

    const { start, end, day } = formData;

    if (!start || !end) {
      alert("Please fill start and end time.");
      return;
    }

    if (end <= start) {
      alert("End time must be later than start time.");
      return;
    }

    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    const diffMinutes = (endDate - startDate) / (1000 * 60);
    if (diffMinutes > 120) {
      alert("Spray duration cannot exceed 2 hours.");
      return;
    }

    const newSchedule = {
      batchid: selectedBatch,
      day: day === 'every' ? 'Every Day' : day.charAt(0).toUpperCase() + day.slice(1),
      stime: start,
      endtime: end
    };

    try {
      const response = await axios.post("http://localhost:5000/sprays", newSchedule, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSchedules([...schedules, response.data.sprays || response.data]);

      setFormData({ day: 'every', start: '', end: '' });
      setSelectedBatch("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Failed to add schedule:", error);
        alert("Failed to add schedule. See console for details.");
      }
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/sprays/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(prev => prev.filter(schedule => schedule._id !== id));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) return '--:--';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const controlRelay = async (isOn) => {
    if (isOn) {
      try {
        const res1 = await axios.get(`http://localhost:5000/iot/sprayOn`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const res2 = await axios.get(`http://localhost:5000/iot/buzzerOn`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Water pump is ON", { sprayOn: res1.status, buzzerOn: res2.status });
      } catch (error) {
        console.error('Error controlling relay:', error);
      }
    } else {
      try {
        const res1 = await axios.get(`http://localhost:5000/iot/sprayOff`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const res2 = await axios.get(`http://localhost:5000/iot/buzzerOff`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Water pump is OFF", { sprayOff: res1.status, buzzerOff: res2.status });
      } catch (error) {
        console.error('Error controlling relay:', error);
      }
    }
  };

  useEffect(() => {
    const checkSchedules = async () => {
      const currentTime = new Date();
      const currentDay = currentTime.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

      let shouldTurnOn = false;
      const list = Array.isArray(schedulesRef.current) ? schedulesRef.current : [];
      list.forEach(schedule => {
        // Normalize day string (trim, lowercase)
        const rawDay = (schedule.day || '').toString().trim();
        const scheduleDay = rawDay.toLowerCase();

        // Accept both 'every' or 'Every Day' variations
        const isEvery = scheduleDay === 'every' || scheduleDay === 'every day' || scheduleDay === 'everyday';

        if (isEvery || scheduleDay === currentDay) {
          // Parse times safely. Support formats: 'HH:MM', 'H:MM', and 'h:mm AM/PM'
          const parseTime = (t) => {
            if (!t) return null;
            const s = t.toString().trim();
            // If basic HH:MM (24h)
            const hhmm = s.match(/^(\d{1,2}):(\d{2})$/);
            if (hhmm) {
              const h = parseInt(hhmm[1], 10);
              const m = parseInt(hhmm[2], 10);
              if (!Number.isNaN(h) && !Number.isNaN(m)) return h * 60 + m;
            }
            // Try to parse AM/PM like '4:26 PM' or '4:26pm' or '4.26 p.m.'
            const ampm = s.match(/(\d{1,2})[:.](\d{2})\s*([ap]m|a\.m\.|p\.m\.|am|pm)?/i);
            if (ampm) {
              let h = parseInt(ampm[1], 10);
              const m = parseInt(ampm[2], 10);
              const ampmPart = (ampm[3] || '').toLowerCase();
              if (ampmPart.includes('p') && h < 12) h += 12;
              if (ampmPart.includes('a') && h === 12) h = 0;
              if (!Number.isNaN(h) && !Number.isNaN(m)) return h * 60 + m;
            }
            // Fallback: try Date parse
            const d = new Date(`1970-01-01T${s}`);
            if (!Number.isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes();
            return null;
          };

          const startMinutes = parseTime(schedule.stime);
          const endMinutes = parseTime(schedule.endtime);
          if (startMinutes === null || endMinutes === null) {
            console.debug('Skipping schedule due to unparsable time', { schedule });
            return; // continue to next schedule
          }

          // Handle schedules that cross midnight (end <= start): treat as two ranges
          if (endMinutes > startMinutes) {
            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
              shouldTurnOn = true;
            }
          } else if (endMinutes < startMinutes) {
            // overnight schedule: start 23:00 end 01:00 -> on if >= start OR < end
            if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
              shouldTurnOn = true;
            }
          } else {
            // start == end -> treat as no-op
          }
          console.debug('Checked schedule', { scheduleDay, startMinutes, endMinutes, currentMinutes, shouldTurnOn });
        }
      });

      // If we don't know prior relay state (null), only send ON command but avoid sending initial OFF
      try {
        if (relayOn === null) {
          if (shouldTurnOn) {
            await controlRelay(true);
            setRelayOn(true);
          } else {
            // don't send OFF on initial load to avoid unnecessary state change
            console.log('Initial relay state unknown; skipping automatic OFF');
          }
        } else if (shouldTurnOn !== relayOn) {
          await controlRelay(shouldTurnOn);
          setRelayOn(shouldTurnOn);
        }
      } catch (err) {
        console.error('Failed to change relay state:', err);
      }
    };

    // run immediately then every 15 seconds (reduce chance of missing short schedules)
    checkSchedules();
    console.debug('Schedule checker started, running every 15s');
    const intervalId = setInterval(() => {
      console.debug('Schedule checker tick');
      checkSchedules();
    }, 15000);  // Check every 15 seconds
    return () => clearInterval(intervalId);
  }, []); // run once; schedulesRef keeps list up-to-date

  return (
    <div>
      {/* Add Water Spray Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">💦</span>
          Batch Water Spray Schedule
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* Batch Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
              <select
                id="batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">-- Select a Batch --</option>
                {Array.isArray(batches) && batches.map(batch => (
                  <option key={batch._id} value={batch.batchid}>
                    Batch {batch.batchid} - {batch.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm" 
                name="day"
                value={formData.day}
                onChange={handleFormChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input 
                type="time" 
                name="start" 
                value={formData.start}
                onChange={handleFormChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <select
                name="end"
                value={formData.end}
                onChange={handleFormChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">-- Select End Time --</option>
                {endOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleAddSchedule}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add Schedule
          </button>
        </div>
      </div>

      {/* Scheduled List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="text-purple-600">📅</span>
          Scheduled List
        </h3>

        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-medium">📍</span>
                  <span className="font-medium text-gray-700">batchid = {schedule.batchid}</span>
                  <span className="font-medium text-gray-700">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-medium">🕐</span>
                  <span className="text-gray-600">
                    {formatTime(schedule.stime)} to {formatTime(schedule.endtime)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  onClick={() => navigate(`/update/${schedule._id}`)}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteSchedule(schedule._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mcontrol;
