const connectDB = require("../db/mongo");
const scrapeJKSattaAllMonths = require("../services/scraper.service");
const { saveResults } = require("../repositories/result.repo");

module.exports = async function handler(req, res) {
  try {
    await connectDB();

    const data = await scrapeJKSattaAllMonths(2026);

    const dbResult = await saveResults(data);

    res.json({
      status: "success",
      scraped: data.totalResults,
      db: dbResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scrape failed" });
  }
};
