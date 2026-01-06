const {
  getAllResults,
} = require("../repositories/result.repo");

async function getAll(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);

    const data = await getAllResults({ page, limit });

    res.json({
      status: "success",
      ...data
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
}
module.exports = {
  getAll,
};
