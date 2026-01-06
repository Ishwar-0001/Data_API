// const express = require("express");
// const cors = require("cors");
// const newsRoutes = require("./routes/scrapping.routes");

// const app = express();

// /* ---------------- Middleware ---------------- */
// app.use(express.json());

// // ✅ Allow Vite frontend
// app.use(
//   cors({
//     origin: "https://frontend-weld-seven-a0rj6yqpp0.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// /* ---------------- Routes ---------------- */
// app.use("/api/check", newsRoutes);

// /* ---------------- Test Route ---------------- */
// app.get("/", (req, res) => {
//   res.send("Data api is running 🚀");
// });

// module.exports = app;

const express = require("express");
const scrapeRoutes = require("./routes/scrape.routes");
const resultRoutes = require("./routes/result.routes");

const app = express();

app.use(express.json());
app.use("/api", scrapeRoutes);
app.use("/api/results", resultRoutes);

module.exports = app;
