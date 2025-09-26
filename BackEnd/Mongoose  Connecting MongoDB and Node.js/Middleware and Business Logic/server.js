// app.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const libraryRoutes = require("./routes/library.routes");

// Connect to DB
connectDB(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/library", libraryRoutes);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Library API is running" });
});


app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found", details: "Endpoint does not exist" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error", details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
