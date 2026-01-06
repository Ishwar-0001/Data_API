const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://frontend-weld-seven-a0rj6yqpp0.vercel.app",
    credentials: true,
  })
);

app.use("/api/check", newsRoutes);

app.get("/", (req, res) => {
  res.send("Data API is running 🚀");
});

module.exports = app;
