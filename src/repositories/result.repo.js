const GameResult = require("../models/result.model");

async function saveResults(scrapeData) {
  const ops = scrapeData.results.map(r => ({
    updateOne: {
      filter: {
        site: scrapeData.site,
        gameId: r.gameId,
        date: r.date
      },
      update: {
        $set: {
          resultNumber: r.resultNumber,
          scrapedAt: scrapeData.scrapedAt
        }
      },
      upsert: true
    }
  }));

  if (!ops.length) return { upserted: 0 };

  const res = await GameResult.bulkWrite(ops, { ordered: false });

  return {
    upserted: res.upsertedCount || 0,
    modified: res.modifiedCount || 0
  };
}

async function getAllResults({ page = 1, limit = 50 }) {
  const skip = (page - 1) * limit;

  const data = await GameResult.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await GameResult.countDocuments();

  return { data, total, page, limit };
}

module.exports = {
  saveResults,
  getAllResults
};