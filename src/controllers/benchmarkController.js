    const Benchmark = require('../models/ExecutionTime');
const PageLoadBenchmark = require('../models/PageLoad');
const MemoryBenchmark = require('../models/MemoryUsage');
const AsyncPerformanceBenchmark = require('../models/AsyncPerformanceBenchmark');
const OptimizationBenchmark = require('../models/OptimizationBenchmark');
const os = require('os');
const si = require('systeminformation');
const escomplex = require('escomplex');
const { performance } = require('perf_hooks');
exports.startBenchmark = async (req, res) => {
  try {
    const { testType, testCodes, testConfig, javascriptType } = req.body;

    if (!testType || !testCodes || !testConfig || !javascriptType) {
      return res.status(400).json({ success: false, error: "Please provide all required fields: testType, testCodes, testConfig, and javascriptType." });
    }

    const results = testCodes.map((code, index) => {
      let iterationsResults = [];
      let complexityReport = escomplex.analyse(code, { logicalor: true, switchcase: true });
      let complexitySummary = {
        cyclomatic: complexityReport.aggregate.cyclomatic,
        sloc: complexityReport.aggregate.sloc,
        halstead: complexityReport.aggregate.halstead,
        maintainability: complexityReport.aggregate.maintainability
      };
      for (let i = 0; i < testConfig.iterations; i++) {
        const startTime = performance.now();
        eval(code);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        iterationsResults.push({
          iteration: i + 1,
          executionTime: `${executionTime.toFixed(2)} ms`
        });
      }

      const averageExecutionTime = iterationsResults.reduce((acc, curr) => acc + parseFloat(curr.executionTime), 0) / testConfig.iterations;

      return {
        testCodeNumber: index + 1, // adding a test code number for clarity
        testCode: code,
        iterationsResults: iterationsResults,
        averageExecutionTime: `${averageExecutionTime.toFixed(2)} ms`,
        complexity: complexitySummary      };
    });

    const overallAverage = results.reduce((acc, curr) => acc + parseFloat(curr.averageExecutionTime), 0) / results.length;

    const benchmark = await Benchmark.create({
      javascriptType,
      testType,
      testConfig,
      results,
      overallAverage: `${overallAverage.toFixed(2)} ms`
    });
    const cpuInfo = os.cpus()[0];
    const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const osInfo = {
      type: os.type(),
      platform: os.platform(),
      release: os.release(),
      arch: os.arch()
    };

    // Mendapatkan informasi GPU dan detail lainnya menggunakan systeminformation
const systemInfo = await si.getStaticData();
    const hardwareInfo = {
      os: osInfo,
      cpu: {
        model: cpuInfo.model,
        speed: `${cpuInfo.speed} MHz`
      },      totalMemory: `${totalMemoryGB} GB`,
      freeMemory: `${freeMemoryGB} GB`,
      gpu: systemInfo.graphics.controllers.map(gpu => ({
        model: gpu.model,
        vram: gpu.vram ? `${gpu.vram} MB` : 'N/A'
      })),
      system: {
        manufacturer: systemInfo.system.manufacturer,
        model: systemInfo.system.model,
        version: systemInfo.system.version
      }
    };


    res.status(201).json({
      success: true,
      message: `Rata-rata execution time dari ${testConfig.iterations} iterasi: ${overallAverage.toFixed(2)} ms`,
      data: benchmark,
      hardware: hardwareInfo

    });
  } catch (error) {
    console.error('Error during benchmark execution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.startMemoryBenchmark = async (req, res) => {
  try {
      const { testType, testCodes, testConfig, javascriptType } = req.body;

      if (!testType || !testCodes || !testConfig || !javascriptType) {
          return res.status(400).json({
              success: false,
              error: "Please provide all required fields: testType, testCodes, testConfig, and javascriptType."
          });
      }

      const results = testCodes.map((code, index) => {
          let iterationsResults = [];
          for (let i = 0; i < testConfig.iterations; i++) {
              const used = process.memoryUsage().heapUsed / 1024 / 1024;
              eval(code);
              const newUsed = process.memoryUsage().heapUsed / 1024 / 1024;
              const memoryUsage = newUsed - used;

              iterationsResults.push({
                  iteration: i + 1,
                  memoryUsage: `${memoryUsage.toFixed(2)} MB`
              });
          }

          const averageMemoryUsage = iterationsResults.reduce((acc, curr) => acc + parseFloat(curr.memoryUsage), 0) / testConfig.iterations;

          return {
              testCodeNumber: index + 1,
              testCode: code,
              iterationsResults: iterationsResults,
              averageMemoryUsage: `${averageMemoryUsage.toFixed(2)} MB`
          };
      });

      const overallAverageMemoryUsage = results.reduce((acc, curr) => acc + parseFloat(curr.averageMemoryUsage), 0) / results.length;

      const benchmark = await MemoryBenchmark.create({
          javascriptType,
          testType,
          testConfig,
          results,
          overallAverageMemoryUsage: `${overallAverageMemoryUsage.toFixed(2)} MB`
      });

      res.status(201).json({
          success: true,
          message: `Rata-rata penggunaan memori dari ${testConfig.iterations} iterasi: ${overallAverageMemoryUsage.toFixed(2)} MB`,
          data: benchmark
      });
  } catch (error) {
      console.error('Error during memory benchmark execution:', error);
      res.status(500).json({ success: false, error: error.message });
  }
};

exports.startPageLoadBenchmark = async (req, res) => {
  try {
      const { testType, testCodes, testConfig, javascriptType } = req.body;

      if (!testType || !testCodes || !testConfig || !javascriptType) {
          return res.status(400).json({ success: false, error: "Please provide all required fields: testType, testCodes, testConfig, and javascriptType." });
      }

      const results = testCodes.map((code, index) => {
          let iterationsResults = [];
          for (let i = 0; i < testConfig.iterations; i++) {
              const start = performance.now();
              eval(code);
              const end = performance.now();
              const pageLoadTime = end - start;

              iterationsResults.push({
                  iteration: i + 1,
                  pageLoadTime: `${pageLoadTime.toFixed(2)} ms`
              });
          }

          const averagePageLoadTime = iterationsResults.reduce((acc, curr) => acc + parseFloat(curr.pageLoadTime), 0) / testConfig.iterations;

          return {
              testCodeNumber: index + 1,
              testCode: code,
              iterationsResults: iterationsResults,
              averagePageLoadTime: `${averagePageLoadTime.toFixed(2)} ms`
          };
      });

      const overallAveragePageLoadTime = results.reduce((acc, curr) => acc + parseFloat(curr.averagePageLoadTime), 0) / results.length;

      const pageLoadBenchmark = await PageLoadBenchmark.create({
          javascriptType,
          testType,
          testConfig,
          results,
          overallAveragePageLoadTime: `${overallAveragePageLoadTime.toFixed(2)} ms`
      });

      res.status(201).json({
          success: true,
          message: `Rata-rata page load time dari ${testConfig.iterations} iterasi: ${overallAveragePageLoadTime.toFixed(2)} ms`,
          data: pageLoadBenchmark
      });
  } catch (error) {
      console.error('Error during page load benchmark execution:', error);
      res.status(500).json({ success: false, error: error.message });
  }
};
exports.startAsyncPerformanceBenchmark = async (req, res) => {
  try {
      const { testType, testCodes, testConfig, javascriptType } = req.body;

      if (!testType || !testCodes || !testConfig || !javascriptType) {
          return res.status(400).json({ success: false, error: "Please provide all required fields: testType, testCodes, testConfig, and javascriptType." });
      }

      const results = await Promise.all(testCodes.map(async (code, index) => {
          let iterationsResults = [];
          for (let i = 0; i < testConfig.iterations; i++) {
              const startTime = Date.now();
              await eval(code); // Assumption: code is asynchronous
              const endTime = Date.now();
              const executionTime = endTime - startTime;

              iterationsResults.push({
                  iteration: i + 1,
                  executionTime: executionTime
              });
          }

          const averageAsyncExecution = iterationsResults.reduce((acc, curr) => acc + curr.executionTime, 0) / testConfig.iterations;

          return {
              testCodeNumber: index + 1,
              testCode: code,
              iterationsResults: iterationsResults,
              averageAsyncExecution: averageAsyncExecution
          };
      }));

      const overallAverageAsyncExecution = results.reduce((acc, curr) => acc + curr.averageAsyncExecution, 0) / results.length;

      const benchmark = await AsyncPerformanceBenchmark.create({
          javascriptType,
          testType,
          testConfig,
          results,
          overallAverageAsyncExecution
      });

      res.status(201).json({
          success: true,
          message: `Rata-rata waktu eksekusi dari ${testConfig.iterations} iterasi: ${overallAverageAsyncExecution.toFixed(2)} ms`,
          data: benchmark
      });
  } catch (error) {
      console.error('Error during asynchronous performance benchmark execution:', error);
      res.status(500).json({ success: false, error: error.message });
  }
};

exports.startOptimizationBenchmark = async (req, res) => {
  try {
    const { optimizationTechnique, testCodeBefore, testCodeAfter, testConfig, javascriptType } = req.body;

    if (!optimizationTechnique || !testCodeBefore || !testCodeAfter || !testConfig, javascriptType) {
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
      javascriptType,
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


