const scrapeService = require("../services/scraper.service");
const { saveResults } = require("../repositories/result.repo");

async function scrapeController(req, res) {
  try {
    const data = await scrapeService(process.env.SCRAPE_START_YEAR);
    const db = await saveResults(data);

    res.json({
      status: "success",
      scraped: data.totalResults,
      database: db
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
}

module.exports = scrapeController;
