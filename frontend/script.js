import { currentLang, toArabicNumber } from './ui.js';

const apiURL = "http://127.0.0.1:5000/api/sensors/latest";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', 
                    hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return date.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US', options);
}

function fetchLatestData() {
  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("tempVal").innerText = data.temperature !== undefined
        ? (currentLang === 'ar' ? toArabicNumber(data.temperature) : data.temperature) + " °C"
        : "--";

      document.getElementById("humVal").innerText = data.humidity !== undefined
        ? (currentLang === 'ar' ? toArabicNumber(data.humidity) : data.humidity) + " %"
        : "--";

      document.getElementById("lightVal").innerText = data.light !== undefined
        ? (currentLang === 'ar' ? toArabicNumber(data.light) : data.light)
        : "--";

      document.getElementById("waterVal").innerText = data.waterLevel !== undefined
        ? (currentLang === 'ar' ? toArabicNumber(data.waterLevel) : data.waterLevel)
        : "--";

      document.getElementById("soilVal").innerText = data.soilMoisture !== undefined
        ? (data.soilMoisture === 0 ? (currentLang === 'ar' ? "جافة" : "dry") : (currentLang === 'ar' ? "رطبة" : "wet"))
        : "--";

      document.getElementById("timeVal").innerText = data.timestamp
        ? (currentLang === 'ar' ? toArabicNumber(formatTime(data.timestamp)) : formatTime(data.timestamp))
        : "--";
    })
    .catch(err => {
      console.error("❌ Error fetching sensor data:", err);
    });
}


setInterval(fetchLatestData, 3000);
fetchLatestData();
