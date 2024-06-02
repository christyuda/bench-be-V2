const mongoose = require('mongoose');

function connectDB() {
    const dbURI = process.env.MONGO_BENCHMARK;
    const options = {
      useNewUrlParser: true,
     
    };

    console.log('Attempting to connect to MongoDB...');

    mongoose.connect(dbURI, options)
      .then(() => {
        console.log('✅ MongoDB connected successfully!');
        console.log(`Current database: ${mongoose.connection.name}`);
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
      });

    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected');
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('🛑 Mongoose disconnected through app termination');
        process.exit(0);
      });
    });
}

module.exports = connectDB;
