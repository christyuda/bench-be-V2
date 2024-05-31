require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Use built-in middleware for json body parsing
app.use(express.json());
connectDB();

// Import routes
const userRoutes = require('./src/routes/authRoutes');
const benchmarkRoutes = require('./src/routes/benchmarkRoutes');

// Use routes
app.use('/api/auth', userRoutes);
app.use('/api/benchmark', benchmarkRoutes);

// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('JWT Key:', process.env.JWT_KEY_SECRET);
});
