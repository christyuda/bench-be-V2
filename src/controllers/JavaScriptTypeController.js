const JavaScriptType = require("../models/JavaScriptType");

class JavaScriptTypeController {
  static async addJavaScriptType(req, res) {
    try {
      const { name, description, category } = req.body;
      const newType = new JavaScriptType({ name, description, category });
      await newType.save();
      res
        .status(201)
        .send({
          message: "New JavaScript type added successfully",
          data: newType,
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Failed to add new type", error: error.message });
    }
  }
}

module.exports = JavaScriptTypeController;
