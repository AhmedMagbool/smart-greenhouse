const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Sensor = require("./models/Sensor")
const cors = require("cors")

dotenv.config()
const app = express()

// ✅ تحسين إعدادات CORS للجوال
app.use(
  cors({
    origin: [
      "https://ahmedmagbool.github.io",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      // ✅ إضافة دعم للجوال
      /^https?:\/\/.*\.github\.io$/,
      /^https?:\/\/.*\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())

// ✅ إضافة middleware لمنع sleep mode
app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate")
  res.header("Pragma", "no-cache")
  res.header("Expires", "0")
  next()
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// ✅ إضافة health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.get("/", (req, res) => {
  res.json({
    message: "Smart Greenhouse API is running!",
    endpoints: {
      latest: "/api/sensors/latest",
      all: "/api/sensors",
      post: "/api/sensors",
    },
  })
})

// 🔁 Get all sensor data
app.get("/api/sensors", async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(100)
    res.json(data)
  } catch (err) {
    console.error("Error fetching sensors:", err)
    res.status(500).json({ error: "Failed to fetch sensor data" })
  }
})

// ✅ Get latest sensor reading - محسن للجوال
app.get("/api/sensors/latest", async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ timestamp: -1 })
    if (!latest) {
      return res.status(404).json({
        error: "No data found",
        message: "No sensor data available in database",
      })
    }

    // ✅ إضافة معلومات إضافية للتشخيص
    res.json({
      ...latest.toObject(),
      serverTime: new Date().toISOString(),
      dataAge: Date.now() - new Date(latest.timestamp).getTime(),
    })
  } catch (err) {
    console.error("Error fetching latest data:", err)
    res.status(500).json({ error: "Failed to fetch latest data" })
  }
})

// 📥 Receive new data from ESP32
app.post("/api/sensors", async (req, res) => {
  try {
    console.log("Received data:", req.body)
    const newData = new Sensor({
      ...req.body,
      timestamp: new Date(),
    })
    await newData.save()
    res.status(201).json({ message: "Data saved successfully" })
  } catch (err) {
    console.error("Error saving data:", err)
    res.status(400).json({ error: "Failed to save data" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Mobile-friendly CORS enabled`)
})
