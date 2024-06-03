const JavaScriptLibrary = require("../models/JavaScriptLibrary");

class JavaScriptLibraryController {
  static async getLibraries(req, res) {
    try {
      const data = await JavaScriptLibrary.fetchLibraries();
      res.json(data);
    } catch (error) {
      res.status(500).send("Error fetching JavaScript libraries");
    }
  }
}

module.exports = JavaScriptLibraryController;
