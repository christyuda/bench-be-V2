const mongoose = require("mongoose");

const javaScriptTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  version: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d+\.\d+\.\d+$/.test(v);  // Validates a simple semantic versioning
      },
      message: props => `${props.value} is not a valid version number!`
    }
  },
  });

const JavaScriptType = mongoose.model("JavaScriptType", javaScriptTypeSchema);

module.exports = JavaScriptType;
