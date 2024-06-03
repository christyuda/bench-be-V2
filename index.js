require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Use built-in middleware for json body parsing
app.use(express.json());
connectDB();

// Import routes
const userRoutes = require("./src/routes/authRoutes");
const benchmarkRoutes = require("./src/routes/benchmarkRoutes");
const libraryRoutes = require("./src/routes/libraryRoutes");
const javaScriptTypeRoutes = require("./src/routes/javaScriptTypeRoutes");
const getAllJavaScriptTypes = require("./src/routes/libraryController");

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to My API</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: #121212;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }
        .container {
          text-align: center;
          max-width: 800px;
          padding: 20px;
        }
        h1 {
          font-size: 48px;
          color: #0dafff;
          margin: 0 0 20px;
          animation: scaleIn 1s both;
        }
        p {
          font-size: 20px;
          line-height: 1.5;
          margin: 20px 0;
          animation: fadeInUp 2s both;
        }
        @keyframes scaleIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to My API</h1>
        <p>This page is the gateway to a futuristic, high-tech API.</p>
      </div>
    </body>
    </html>
  `);
});

// Use routes
app.use("/api/auth", userRoutes);
app.use("/api/benchmark", benchmarkRoutes);
app.use("/api/libraryjs", libraryRoutes);
app.use("/api/typesjs", javaScriptTypeRoutes);
app.use("/api/all-js", getAllJavaScriptTypes);



// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route does not exist.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("JWT Key:", process.env.JWT_KEY_SECRET);
});
