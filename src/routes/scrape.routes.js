const express = require("express");
const { scrapeController } = require("../controllers/scrape.controller");

const router = express.Router();

router.post("/", scrapeController);

module.exports = router;
