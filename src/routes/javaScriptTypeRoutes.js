const express = require("express");
const JavaScriptTypeController = require("../controllers/JavaScriptTypeController");
const router = express.Router();

// Route to add a new JavaScript type
router.post("/", JavaScriptTypeController.addJavaScriptType);

module.exports = router;
