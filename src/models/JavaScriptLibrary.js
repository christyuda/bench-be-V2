const fetch = require("node-fetch");

class JavaScriptLibrary {
  static async fetchLibraries() {
    const url =
      "https://registry.npmjs.org/-/v1/search?text=javascript+library&size=50";
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch libraries:", error);
      throw error;
    }
  }
}

module.exports = JavaScriptLibrary;
