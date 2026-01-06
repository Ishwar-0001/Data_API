const express = require("express");
const scrapeController = require("../controllers/scrape.controller");

const router = express.Router();

router.get("/scrape", scrapeController);

module.exports = router;
