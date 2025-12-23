// src/Components/LineChart.js
import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip
);

const LineChart = ({ temp, humidity }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const dataHistoryRef = useRef({
    labels: [],
    temperature: [],
    humidity: []
  });

  // Debug logging
  console.log('📊 LineChart received props:', { temp, humidity, tempType: typeof temp, humidityType: typeof humidity });

  // Initialize chart
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Initialize with some sample data
    const initialLabels = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'];
    const initialTemp = [24, 26, 27, 25, 26];
    const initialHumidity = [50, 52, 55, 53, 50];

    dataHistoryRef.current = {
      labels: [...initialLabels],
      temperature: [...initialTemp],
      humidity: [...initialHumidity]
    };

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: initialLabels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: initialTemp,
            borderColor: 'rgb(239, 68, 68)', // red-500
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Humidity (%)',
            data: initialHumidity,
            borderColor: 'rgb(34, 197, 94)', // green-500
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            },
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2,
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []); // Only run once on mount

  // Update chart when new data arrives
  useEffect(() => {
    if (chartInstanceRef.current && (typeof temp === 'number' || typeof humidity === 'number')) {
      const chart = chartInstanceRef.current;
      const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Add new data point
      dataHistoryRef.current.labels.push(currentTime);
      
      // Update temperature if provided
      if (typeof temp === 'number') {
        dataHistoryRef.current.temperature.push(temp);
      } else {
        // If no new temp, use the last value
        const lastTemp = dataHistoryRef.current.temperature[dataHistoryRef.current.temperature.length - 1];
        dataHistoryRef.current.temperature.push(lastTemp || 0);
      }

      // Update humidity if provided
      if (typeof humidity === 'number') {
        dataHistoryRef.current.humidity.push(humidity);
      } else {
        // If no new humidity, use the last value
        const lastHumidity = dataHistoryRef.current.humidity[dataHistoryRef.current.humidity.length - 1];
        dataHistoryRef.current.humidity.push(lastHumidity || 0);
      }

      // Keep only the last 15 data points for better visibility
      const maxDataPoints = 15;
      if (dataHistoryRef.current.labels.length > maxDataPoints) {
        dataHistoryRef.current.labels = dataHistoryRef.current.labels.slice(-maxDataPoints);
        dataHistoryRef.current.temperature = dataHistoryRef.current.temperature.slice(-maxDataPoints);
        dataHistoryRef.current.humidity = dataHistoryRef.current.humidity.slice(-maxDataPoints);
      }

      // Update chart data
      chart.data.labels = [...dataHistoryRef.current.labels];
      chart.data.datasets[0].data = [...dataHistoryRef.current.temperature];
      chart.data.datasets[1].data = [...dataHistoryRef.current.humidity];

      // Animate the update
      chart.update('active');
    }
  }, [temp, humidity]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Environmental Monitoring
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Current Temp: {typeof temp === 'number' ? `${temp}°C` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Current Humidity: {typeof humidity === 'number' ? `${humidity}%` : 'N/A'}</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default LineChart;