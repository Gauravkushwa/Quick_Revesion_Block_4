const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/task.routes");

connectDB();
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/api", taskRoutes);

app.get("/", (req, res) => res.send("Task API Running"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
