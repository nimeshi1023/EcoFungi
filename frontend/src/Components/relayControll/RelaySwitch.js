// components/RelaySwitch.js
import React, { useState } from 'react';

function RelaySwitch() {
  const [isOn, setIsOn] = useState(false);

  const toggleRelay = async () => {
    const token = "5zV5DqmmwIKanPx7JJeg-fqVeOG8oB5n";
    const value = isOn ? 0 : 1;

    try {
      const res = await fetch(`https://blynk.cloud/external/api/update?token=${token}&V1=${value}`);
      if (res.ok) {
        setIsOn(!isOn);
      } else {
        console.error("Failed to send command to Blynk");
      }
    } catch (error) {
      console.error("Error connecting to Blynk:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={toggleRelay}
        className={`px-4 py-2 rounded text-white ${isOn ? "bg-green-500" : "bg-gray-500"}`}
      >
        {isOn ? "Turn OFF Relay" : "Turn ON Relay"}
      </button>
    </div>
  );
}

export default RelaySwitch;
