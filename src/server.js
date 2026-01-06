require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Backend ${PORT} port par chal raha`);
});


// require("dotenv").config();
// const app = require("./app");

// module.exports = (req, res) => {
//   return app(req, res);
// };
