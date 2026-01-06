const express = require("express");
const controller = require("../controllers/result.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.createOrUpdate); // create OR update

module.exports = router;
