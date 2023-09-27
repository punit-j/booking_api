import express from "express";
import { PORT } from "../config/config.mjs";
import { sequelize, testDatabaseConnection } from './sequelize/sequelize.js';
import indexRouter from "./routes/index.js";

const app = express();
const _PORT = PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Test the database connection
testDatabaseConnection();

app.use(indexRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
sequelize
  .sync() // This will sync your models with the database
  .then(() => {
    app.listen(_PORT, () => {
      console.log(`Server is running on port ${_PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database synchronization error:', error);
});
