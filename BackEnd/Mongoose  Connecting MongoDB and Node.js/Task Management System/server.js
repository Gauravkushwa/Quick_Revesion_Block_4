require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/task.routes");

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api", taskRoutes);

app.get("/", (req, res) => res.json({ message: "Task API running" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
