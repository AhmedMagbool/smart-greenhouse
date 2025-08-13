import { formatTime, formatNumber, t } from "./ui.js"

// ✅ إصلاح الرابط ليشمل endpoint الصحيح
const apiURL = "https://smart-greenhouse-2aaw.onrender.com/api/sensors/latest"

function fetchLatestData() {
  // ✅ إضافة timeout وتحسين error handling
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 seconds timeout

  fetch(apiURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal,
  })
    .then((res) => {
      clearTimeout(timeoutId)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return res.json()
    })
    .then((data) => {
      console.log("✅ Data received:", data) // للتشخيص

      // ✅ تحسين عرض البيانات مع التحقق من وجودها
      document.getElementById("tempVal").innerText =
        data.temperature !== undefined ? formatNumber(data.temperature) + " °C" : "--"

      document.getElementById("humVal").innerText =
        data.humidity !== undefined ? formatNumber(data.humidity) + " %" : "--"

      document.getElementById("lightVal").innerText = data.light !== undefined ? formatNumber(data.light) : "--"

      document.getElementById("waterVal").innerText =
        data.waterLevel !== undefined ? formatNumber(data.waterLevel) : "--"

      document.getElementById("soilVal").innerText =
        data.soilMoisture !== undefined ? (data.soilMoisture === 0 ? t("dry") : t("wet")) : "--"

      document.getElementById("timeVal").innerText = data.timestamp ? formatTime(data.timestamp) : "--"

      // ✅ إضافة مؤشر للاتصال الناجح
      document.body.classList.remove("connection-error")
    })
    .catch((err) => {
      clearTimeout(timeoutId)
      console.error("❌ Error fetching sensor data:", err)

      // ✅ إضافة مؤشر بصري للخطأ
      document.body.classList.add("connection-error")

      // ✅ عرض رسالة خطأ للمستخدم
      const errorMsg = t("connectionError")
      document.getElementById("tempVal").innerText = errorMsg
    })
}

// ✅ تقليل تكرار الطلبات لتوفير البيانات
setInterval(fetchLatestData, 5000) // كل 5 ثواني بدلاً من 3
fetchLatestData()

// ✅ Listen for language changes to update data display
window.addEventListener("languageChanged", () => {
  fetchLatestData() // Re-fetch to update number formatting
})
