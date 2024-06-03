const mongoose = require("mongoose");

const javaScriptTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'library', 'framework', 'tool'
});

const JavaScriptType = mongoose.model("JavaScriptType", javaScriptTypeSchema);

module.exports = JavaScriptType;
