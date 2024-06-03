const mongoose = require('mongoose');

const MemoryBenchmarkSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true,
  },
  testCode: {
    type: String,
    required: true,
  },
  testConfig: {
    type: Object,
    required: true,
  },
  results: {
    type: Array,
    required: true,
  },
  averageMemoryUsage: {
    type: Number,
  },
  totalAverageMemoryUsage: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  javascriptType: {  
    type: String,
    required: true
  },
});

const MemoryBenchmark = mongoose.model('MemoryBenchmark', MemoryBenchmarkSchema);

module.exports = MemoryBenchmark;
