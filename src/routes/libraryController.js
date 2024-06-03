const express = require('express');
const JavaScriptLibraryController = require('../controllers/javascript-all');
const router = express.Router();

// Route for getting all JavaScript resources
router.get('/', JavaScriptLibraryController.getAllJavaScriptResources);

module.exports = router;
