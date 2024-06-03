const express = require('express');
const JavaScriptTypeController = require('../controllers/JavaScriptTypeController');
const router = express.Router();

router.post('/insert', JavaScriptTypeController.addJavaScriptType);
router.get('/', JavaScriptTypeController.getAllJavaScriptTypes);
router.get('/get/:id', JavaScriptTypeController.getJavaScriptType);
router.put('/update/:id', JavaScriptTypeController.updateJavaScriptType);
router.delete('/delete/:id', JavaScriptTypeController.deleteJavaScriptType);

module.exports = router;
