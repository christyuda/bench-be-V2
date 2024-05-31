const express = require('express');
const router = express.Router();

const benchmarkController = require('../controllers/benchmarkController');
const verifyToken = require('../middleware/auth');

router.post('/start-execution-time',verifyToken, benchmarkController.startBenchmark);
router.post('/start-memory-usage', verifyToken,benchmarkController.startMemoryBenchmark);
router.post('/start-page-load', verifyToken,benchmarkController.startPageLoadBenchmark);
router.post('/async-performance-benchmark', verifyToken, benchmarkController.startAsyncPerformanceBenchmark);
router.post('/compare-performance', verifyToken,benchmarkController.startOptimizationBenchmark);

router.get('/results', verifyToken, benchmarkController.getBenchmarkResults);
router.get('/results/execution-time', verifyToken,benchmarkController.getExecutionTimeResults);
router.get('/results/memory-usage', verifyToken,benchmarkController.getMemoryBenchmarkResults);
router.get('/results/page-load', verifyToken,benchmarkController.getPageLoadBenchmarkResults);
router.get('/results/async-performance', verifyToken,benchmarkController.getAsyncPerformanceBenchmarkResults);


module.exports = router;