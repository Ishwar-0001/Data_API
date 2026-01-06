const scrapeJKSatta = require("../scrapers/jksattaScraper");
const testing = require('../scrapers/scrapeJKSattaAllMonths');

exports.getScraped = async (req, res) => {
  const data = await scrapeJKSatta();
  res.json(data);
};

exports.testingData = async (req, res) => {
  const data2 = await testing();
  res.json(data2);
};
