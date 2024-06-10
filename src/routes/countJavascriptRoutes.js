const express = require("express");
const JavascriptCount = require("../controllers/countJavascript");
const router = express.Router();

router.get("/", JavascriptCount.aggregateJavaScriptTypes);

module.exports = router;
