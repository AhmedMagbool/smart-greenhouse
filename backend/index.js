const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sensor = require('./models/Sensor');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Smart Greenhouse API is running!');
});

// 🔁 Get all sensor data
app.get('/api/sensors', async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

// ✅ Get latest sensor reading
app.get('/api/sensors/latest', async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ error: 'No data found' });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest data' });
  }
});

// 📥 Receive new data from ESP32
app.post('/api/sensors', async (req, res) => {
  try {
    const newData = new Sensor(req.body);
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to save data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
