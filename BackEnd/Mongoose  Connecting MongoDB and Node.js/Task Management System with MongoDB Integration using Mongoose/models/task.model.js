const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,       // e.g. "pending", "completed"
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
