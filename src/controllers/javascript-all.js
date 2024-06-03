const JavaScriptLibrary = require("../models/JavaScriptLibrary");
const JavaScriptType = require("../models/JavaScriptType");

class JavaScriptLibraryController {
  static async getAllJavaScriptResources(req, res) {
    try {
      const externalLibraries = await JavaScriptLibrary.fetchLibraries();
      const internalTypes = await JavaScriptType.find();

      // Merge external and internal data into a single array
      const allJavaScriptTypes = [
        ...externalLibraries.objects.map(lib => ({
          name: lib.package.name,
          description: lib.package.description,
          version: lib.package.version,
          source: 'external' // Optionally mark the source
        })),
        ...internalTypes.map(type => ({
          name: type.name,
          description: type.description,
          category: type.category,
            version: type.version,
          source: 'internal' // Optionally mark the source
        }))
      ];

      // Sort merged array if needed, for example by name
      allJavaScriptTypes.sort((a, b) => a.name.localeCompare(b.name));

      // Send the combined data as response
      res.status(200).json({ allJavaScriptTypes });
    } catch (error) {
      res.status(500).send({ message: 'Failed to get JavaScript resources', error: error.message });
    }
  }
}

module.exports = JavaScriptLibraryController;
