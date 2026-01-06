const scrapeJKSatta = require("../scrapers/jksattaScraper");
const testing = require('../scrapers/scrapeJKSattaAllMonths');

exports.getScraped = async (req, res) => {
  const data = await scrapeJKSatta();
  res.json(data);
};

exports.testingData = async (req, res) => {
  try {
    const data = await scrapeJKSattaAllMonths();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Scraping failed",
      error: error.message,
    });
  }
};
