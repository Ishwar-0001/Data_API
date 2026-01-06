const express = require("express");
const { getScraped } = require("../controllers/scrapping.controller");
const {testingData} = require('../controllers/scrapping.controller');

const router = express.Router();

router.get("/scrape", getScraped);
router.get("/testingwala",testingData );

module.exports = router;
