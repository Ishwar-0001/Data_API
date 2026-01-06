const {
  getAllResults,
  createOrUpdateResult
} = require("../repositories/result.repo");

/**
 * GET /api/results
 */
async function getAll(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 50);

    const { data, total } = await getAllResults({ page, limit });

    res.status(200).json({
      status: "success",
      data,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error("Get results error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch results"
    });
  }
}

/**
 * POST /api/results
 * User create or update
 */
async function createOrUpdate(req, res) {
  try {
    const { gameId, date, resultNumber } = req.body;

    if (!gameId || !date || !resultNumber) {
      return res.status(400).json({
        status: "error",
        message: "gameId, date and resultNumber are required"
      });
    }

    const result = await createOrUpdateResult({
      gameId,
      date,
      resultNumber
    });

    res.status(200).json({
      status: "success",
      data: result
    });
  } catch (err) {
    console.error("Create/update error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create or update result"
    });
  }
}

module.exports = {
  getAll,
  createOrUpdate
};
