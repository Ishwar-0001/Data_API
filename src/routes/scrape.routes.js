const express = require("express");
const { scrape } = require("../controllers/scrape.controller");

const router = express.Router();

router.post("/", scrape);

module.exports = router;
