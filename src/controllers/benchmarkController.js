    const Benchmark = require('../models/ExecutionTime');
const PageLoadBenchmark = require('../models/PageLoad');
const MemoryBenchmark = require('../models/MemoryUsage');
const AsyncPerformanceBenchmark = require('../models/AsyncPerformanceBenchmark');
const OptimizationBenchmark = require('../models/OptimizationBenchmark');


const { performance } = require('perf_hooks');

exports.startBenchmark = async (req, res) => {
  try {
    const { testType, testCode, testConfig } = req.body;

    if (!testType || !testCode || !testConfig) {
      return res.status(400).json({ success: false, error: "Harap berikan testType, testCode, dan testConfig." });
    }

    const iterations = testConfig.iterations || 1;

    const results = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      eval(testCode); 
      const endTime = performance.now();

      const executionTime = endTime - startTime;

      results.push(executionTime);
    }

    const averageExecutionTime = results.reduce((total, current) => total + current, 0) / results.length;
    const totalAverage = `${averageExecutionTime.toFixed(2)} ms`;

    const benchmark = await Benchmark.create({
      testType,
      testCode,
      testConfig,
      results,
      averageExecutionTime,
      totalAverage 
    });

    res.status(201).json({ success: true, message: `Rata-rata execution time dari ${iterations} iterasi: ${totalAverage}`, data: benchmark });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.startMemoryBenchmark = async (req, res) => {
    try {
        const { testType, testCode, testConfig } = req.body;
      
        if (!testType || !testCode || !testConfig) {
            return res.status(400).json({ success: false, error: "Harap berikan testType, testCode, dan testConfig." });
        }
  
        const iterations = testConfig.iterations || 1;
  
        const results = [];
  
        for (let i = 0; i < iterations; i++) {
            const used = process.memoryUsage().heapUsed / 1024 / 1024; 
            eval(testCode); 
            const newUsed = process.memoryUsage().heapUsed / 1024 / 1024; 
            const memoryUsage = newUsed - used; 
        
            results.push(memoryUsage);
        }
  
        const averageMemoryUsage = results.reduce((total, current) => total + current, 0) / results.length;
        const totalAverageMemoryUsage = averageMemoryUsage * iterations;

        const benchmark = await MemoryBenchmark.create({
            testType,
            testCode,
            testConfig,
            results,
            averageMemoryUsage,
            totalAverageMemoryUsage

        });
  
        const message = `Rata-rata penggunaan memori dari ${iterations} iterasi: ${averageMemoryUsage.toFixed(2)} MB`;
  
        res.status(201).json({ success: true, message, data: benchmark });
    } catch (error) {
        // Tangani kesalahan
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.startPageLoadBenchmark = async (req, res) => {
    try {
        const { testType, testCode, testConfig } = req.body;


        if (!testType || !testCode || !testConfig) {
            return res.status(400).json({ success: false, error: "Harap berikan testType, testCode, dan testConfig." });
        }

        const iterations = testConfig.iterations || 1;

        const results = [];

        for (let i = 0; i < iterations; i++) {

            const start = performance.now();
            eval(testCode);
            const end = performance.now();


            const pageLoadTime = end - start;

            results.push(pageLoadTime);
        }

        const averagePageLoadTime = results.reduce((total, current) => total + current, 0) / results.length;
        const totalAveragePageLoadTime = averagePageLoadTime * iterations;


        // Simpan hasil benchmark ke dalam database
        const pageLoadBenchmark = await PageLoadBenchmark.create({
            testType,
            testCode,
            testConfig,
            results,
            averagePageLoadTime,
            totalAveragePageLoadTime
        });

        // Kirim respons berhasil bersama dengan data benchmark yang disimpan
        res.status(201).json({ success: true, data: pageLoadBenchmark });
    } catch (error) {
        // Tangani kesalahan
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.startAsyncPerformanceBenchmark = async (req, res) => {
    try {
        const { testType, testCode, testConfig } = req.body;
      
        if (!testType || !testCode || !testConfig) {
            return res.status(400).json({ success: false, error: "Harap berikan testType, testCode, dan testConfig." });
        }
  
        const iterations = testConfig.iterations || 1;
  
        const results = [];
  
        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();
            await eval(testCode); 
            const endTime = Date.now(); 
            const executionTime = endTime - startTime;
        
            results.push(executionTime);
        }
  
        const averageAsyncExecution = results.reduce((total, current) => total + current, 0) / results.length;
        const totalAverageAsyncExecution = iterations * averageAsyncExecution;
        const benchmark = await AsyncPerformanceBenchmark.create({
            testType,
            testCode,
            testConfig,
            results,
            averageAsyncExecution,
            totalAverageAsyncExecution
        });
  
        const message = `Rata-rata waktu eksekusi dari ${iterations} iterasi: ${averageAsyncExecution} ms`;
  
        res.status(201).json({ success: true, message, data: benchmark });
    } catch (error) {
        // Tangani kesalahan
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.startOptimizationBenchmark = async (req, res) => {
  try {
    const { optimizationTechnique, testCodeBefore, testCodeAfter, testConfig } = req.body;

    if (!optimizationTechnique || !testCodeBefore || !testCodeAfter || !testConfig) {
      return res.status(400).json({ success: false, error: "Harap berikan teknik optimisasi, kode uji sebelum, kode uji setelah, dan konfigurasi uji." });
    }

    const iterations = testConfig.iterations || 1;

    const resultsBefore = [];
    const resultsAfter = [];

    
    for (let i = 0; i < iterations; i++) {
      const startBefore = performance.now();
      eval(testCodeBefore);
      const endBefore = performance.now();
      resultsBefore.push(endBefore - startBefore);
    }

    for (let i = 0; i < iterations; i++) {
      const startAfter = performance.now();
      eval(testCodeAfter);
      const endAfter = performance.now();
      resultsAfter.push(endAfter - startAfter);
    }

    const averageExecutionTimeBefore = resultsBefore.reduce((total, current) => total + current, 0) / resultsBefore.length;
    const averageExecutionTimeAfter = resultsAfter.reduce((total, current) => total + current, 0) / resultsAfter.length;

    const optimizationBenchmark = await OptimizationBenchmark.create({
      optimizationTechnique,
      testCodeBefore,
      testCodeAfter,
      testConfig,
      resultsBefore,
      resultsAfter,
      averageExecutionTimeBefore,
      averageExecutionTimeAfter
    });

    res.status(201).json({ success: true, data: optimizationBenchmark });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBenchmarkResults = async (req, res) => {
    try {
      const benchmarks = await Benchmark.find();
      res.status(200).json({ success: true, data: benchmarks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

exports.getMemoryBenchmarkResults = async (req, res) => {
    try {
        const memoryBenchmarkResults = await Benchmark.find({ testType: 'memory_usage' });
  
        res.status(200).json({ success: true, data: memoryBenchmarkResults });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.getExecutionTimeResults = async (req, res) => {
    try {
      // Mengambil hasil benchmark dengan testType "execution_time"
      const executionTimeResults = await Benchmark.find({ testType: 'execution_time' });
  
      res.status(200).json({ success: true, data: executionTimeResults });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };    

exports.getOptimizationBenchmarkResults = async (req, res) => {
    try {
        const optimizationBenchmarkResults = await OptimizationBenchmark.find();
  
        res.status(200).json({ success: true, data: optimizationBenchmarkResults });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAsyncPerformanceBenchmarkResults = async (req, res) => {
    try {
        const asyncPerformanceBenchmarkResults = await AsyncPerformanceBenchmark.find();
  
        res.status(200).json({ success: true, data: asyncPerformanceBenchmarkResults });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPageLoadBenchmarkResults = async (req, res) => {
    try {
        const pageLoadBenchmarkResults = await PageLoadBenchmark.find();
  
        res.status(200).json({ success: true, data: pageLoadBenchmarkResults });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


