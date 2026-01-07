const express = require("express");
const scrapeRoutes = require("./routes/scrape.routes");
const resultRoutes = require("./routes/result.routes");

const app = express();

app.use(express.json());

app.use("/api/scrape", scrapeRoutes);
app.use("/api/results", resultRoutes);

// health check (VERY IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
