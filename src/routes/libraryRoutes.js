const express = require("express");
const JavaScriptLibraryController = require("../controllers/JavaScriptLibrariesController");
const router = express.Router();

router.get("/", JavaScriptLibraryController.getLibraries);

module.exports = router;
