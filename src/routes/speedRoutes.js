const express = require('express');
const router = express.Router();
const speedTestController = require('./../controllers/speedTestController');

router.get('/', speedTestController.testInternetSpeed);

module.exports = router;
