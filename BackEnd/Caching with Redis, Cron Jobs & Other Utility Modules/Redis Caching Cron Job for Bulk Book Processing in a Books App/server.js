/**
 * Entry point for the Books Management API
 * Loads Express, routes, Redis, and starts cron jobs.
 */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { initRedis } = require("./config/redis");
const { setupCronJobs } = require("./config/cron");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Initialize Redis client (singleton)
initRedis();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Start cron job (bulk processing every 2 min)
setupCronJobs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
