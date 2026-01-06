// require("dotenv").config();
// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🔥 Backend ${PORT} port par chal raha`);
// });


// // const app = require("../app");

// // module.exports = app;


require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/mongo");

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
