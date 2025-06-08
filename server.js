// server.js
const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors()); // Allow frontend to fetch from backend

// GET /api/weather – returns data from local file
app.get("/api/weather", async (req, res) => {
  try {
    const fileData = await fs.readFile("weather.json", "utf8");
    const weather = JSON.parse(fileData);
    res.json(weather);
  } catch (err) {
    console.error("Error reading weather.json:", err);
    res.status(500).json({ error: "Failed to load weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
