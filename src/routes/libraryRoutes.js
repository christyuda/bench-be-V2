const express = require("express");
const JavaScriptLibraryController = require("../controllers/JavaScriptLibrariesController");
const router = express.Router();

router.get("/javascript-libraries", JavaScriptLibraryController.getLibraries);

module.exports = router;
