const JavaScriptType = require('../models/JavaScriptType');

class JavaScriptTypeController {
    // Create
    static async addJavaScriptType(req, res) {
      try {
          // Extracting all required fields from req.body
          const { name, description, category, version } = req.body;

          // Check if all fields are provided
          if (!name || !description || !category || !version) {
              return res.status(400).send({ message: 'All fields are required' });
          }

          // Creating a new document in the database
          const newType = new JavaScriptType({
              name,
              description,
              category,
              version
          });

          // Save the new type to the database
          await newType.save();

          // Send a success response back to the client
          res.status(201).send({
              message: 'New JavaScript type added successfully',
              data: newType
          });
      } catch (error) {
          // Handle potential errors such as database errors
          res.status(500).send({
              message: 'Failed to add new type',
              error: error.message
          });
      }
  }



    // Read (All Entries)
    static async getAllJavaScriptTypes(req, res) {
        try {
            const types = await JavaScriptType.find();
            res.status(200).json(types);
        } catch (error) {
            res.status(500).send({ message: 'Failed to get types', error: error.message });
        }
    }

    // Read (Single Entry)
    static async getJavaScriptType(req, res) {
        try {
            const type = await JavaScriptType.findById(req.params.id);
            if (!type) return res.status(404).send({ message: 'Type not found' });
            res.status(200).json(type);
        } catch (error) {
            res.status(500).send({ message: 'Failed to get type', error: error.message });
        }
    }

    // Update
    static async updateJavaScriptType(req, res) {
        try {
            const updatedType = await JavaScriptType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updatedType) return res.status(404).send({ message: 'Type not found' });
            res.status(200).send({ message: 'Type updated successfully', data: updatedType });
        } catch (error) {
            res.status(500).send({ message: 'Failed to update type', error: error.message });
        }
    }

    // Delete
    static async deleteJavaScriptType(req, res) {
        try {
            const deletedType = await JavaScriptType.findByIdAndDelete(req.params.id);
            if (!deletedType) return res.status(404).send({ message: 'Type not found' });
            res.status(200).send({ message: 'Type deleted successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Failed to delete type', error: error.message });
        }
    }
}

module.exports = JavaScriptTypeController;
