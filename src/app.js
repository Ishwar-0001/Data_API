const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

/* ---------------- Middleware ---------------- */
app.use(express.json());

// ✅ Allow Vite frontend
app.use(
  cors({
    origin: "https://frontend-weld-seven-a0rj6yqpp0.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ---------------- Routes ---------------- */
app.use("/api/check", newsRoutes);

/* ---------------- Test Route ---------------- */
app.get("/", (req, res) => {
  res.send("Data api is running 🚀");
});

module.exports = app;
