const express = require("express");
const router = express.Router();
const { generateProfitLoss } = require("../Controllers/ProfitController");

router.post("/generate", generateProfitLoss);

module.exports = router;