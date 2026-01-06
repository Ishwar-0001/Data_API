const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    site: { type: String, required: true },
    gameId: { type: String, required: true },
    date: { type: String, required: true },
    resultNumber: { type: String, required: true },
    scrapedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

ResultSchema.index(
  { site: 1, gameId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("GameResult", ResultSchema);
