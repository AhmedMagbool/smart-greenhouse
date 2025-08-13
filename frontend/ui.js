// 🌐 Language and UI utilities for Smart Greenhouse Dashboard

// ✅ Current language state
export let currentLang = localStorage.getItem("language") || "en"

// ✅ Arabic number conversion
export function toArabicNumber(num) {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit])
}

// ✅ English number conversion (reverse)
export function toEnglishNumber(num) {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  let result = num.toString()
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, "g"), index.toString())
  })
  return result
}

// ✅ Translation object
const translations = {
  en: {
    title: "🌿 Smart Greenhouse Dashboard",
    temperature: "Temperature",
    humidity: "Humidity",
    light: "Light",
    waterLevel: "Water Level",
    soil: "Soil",
    time: "Time",
    dry: "dry",
    wet: "wet",
    connectionError: "Connection error",
    loading: "Loading...",
    noData: "No data available",
    madeBy: "Made by Ahmed & Abdulmajeed",
  },
  ar: {
    title: "🌿 لوحة تحكم البيت المحمي الذكي",
    temperature: "درجة الحرارة",
    humidity: "الرطوبة",
    light: "الإضاءة",
    waterLevel: "مستوى الماء",
    soil: "التربة",
    time: "الوقت",
    dry: "جافة",
    wet: "رطبة",
    connectionError: "خطأ في الاتصال",
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات",
    madeBy: "من تطوير أحمد وعبدالمجيد",
  },
}

// ✅ Get translation
export function t(key) {
  return translations[currentLang][key] || key
}

// ✅ Toggle language
export function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar"
  localStorage.setItem("language", currentLang)
  updateUI()

  // Trigger custom event for other components
  window.dispatchEvent(
    new CustomEvent("languageChanged", {
      detail: { language: currentLang },
    }),
  )
}

// ✅ Update UI elements
export function updateUI() {
  const body = document.body
  const html = document.documentElement

  // Update direction
  if (currentLang === "ar") {
    body.classList.add("rtl")
    html.setAttribute("dir", "rtl")
    html.setAttribute("lang", "ar")
  } else {
    body.classList.remove("rtl")
    html.setAttribute("dir", "ltr")
    html.setAttribute("lang", "en")
  }

  // Update text content
  const elements = {
    "page-title": t("title"),
    "temp-label": `🌡️ ${t("temperature")}`,
    "hum-label": `💧 ${t("humidity")}`,
    "light-label": `💡 ${t("light")}`,
    "water-label": `🌊 ${t("waterLevel")}`,
    "soil-label": `🌱 ${t("soil")}`,
    "time-label": `⏰ ${t("time")}`,
    "footer-text": t("madeBy"),
  }

  Object.entries(elements).forEach(([id, text]) => {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = text
    }
  })

  // Update language toggle button
  const langBtn = document.querySelector(".lang-btn")
  if (langBtn) {
    langBtn.textContent = currentLang === "ar" ? "English" : "عربي"
  }
}

// ✅ Format numbers based on language
export function formatNumber(num) {
  if (typeof num !== "number" && typeof num !== "string") return "--"
  return currentLang === "ar" ? toArabicNumber(num) : num.toString()
}

// ✅ Format time based on language
export function formatTime(dateStr) {
  if (!dateStr) return "--"

  const date = new Date(dateStr)
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }

  const formatted = date.toLocaleString(currentLang === "ar" ? "ar-EG" : "en-US", options)

  return currentLang === "ar" ? toArabicNumber(formatted) : formatted
}

// ✅ Initialize UI on page load
export function initializeUI() {
  // Set initial language
  updateUI()

  // Add event listeners
  const langBtn = document.querySelector(".lang-btn")
  if (langBtn) {
    langBtn.addEventListener("click", toggleLanguage)
  }

  const themeBtn = document.querySelector(".theme-btn")
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme)
  }
}

// ✅ Theme toggle functionality
export function toggleTheme() {
  const body = document.body
  const isDark = body.classList.toggle("dark-mode")
  localStorage.setItem("theme", isDark ? "dark" : "light")

  // Update theme button icon
  const themeBtn = document.querySelector(".theme-btn")
  if (themeBtn) {
    themeBtn.textContent = isDark ? "☀️" : "🌙"
  }
}

// ✅ Initialize theme
export function initializeTheme() {
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-mode")
    const themeBtn = document.querySelector(".theme-btn")
    if (themeBtn) themeBtn.textContent = "☀️"
  }
}

// ✅ Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeUI()
      initializeTheme()
    })
  } else {
    initializeUI()
    initializeTheme()
  }
}
