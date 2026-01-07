const express = require("express");
const cors = require("cors");

const scrapeRoutes = require("./routes/scrape.routes");
const resultRoutes = require("./routes/result.routes");

const app = express();

/**
 * ✅ CORS configuration
 * Replace FRONTEND_URL with your actual frontend URL
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",            
      "https://frontend-zeta-gold-83.vercel.app"  
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.use("/api/scrape", scrapeRoutes);
app.use("/api/results", resultRoutes);

// Health check (Render)
app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
