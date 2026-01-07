const { scrapeJKSattaAllMonths } = require("../services/scraper.service");
const { saveResults } = require("../repositories/result.repo");

async function scrapeController(req, res) {
  try {
    const year = Number(req.query.startYear || 2026);

    const scrapeData = await scrapeJKSattaAllMonths(year);
    const dbResult = await saveResults(scrapeData);

    res.json({
      status: "success",
      ...dbResult
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { scrapeController };
