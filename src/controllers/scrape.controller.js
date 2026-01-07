const { scrapeJKSattaAllMonths } = require("../services/scraper.service");
const { saveResults } = require("../repositories/result.repo");

async function scrape(req, res) {
  try {
    const startYear = Number(req.query.startYear || 2026);

    const scrapeData = await scrapeJKSattaAllMonths(startYear);
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

module.exports = { scrape };
