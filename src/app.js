const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

/* ---------------- Middleware ---------------- */
app.use(express.json());

// ✅ Allow Vite frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ---------------- Routes ---------------- */
app.use("/api/check", newsRoutes);

/* ---------------- Test Route ---------------- */
app.get("/", (req, res) => {
  res.send("Web Scraping API is running 🚀");
});

module.exports = app;
