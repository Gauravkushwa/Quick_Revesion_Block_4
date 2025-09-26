const Task = require("../models/task.model");

const validateTaskData = (req, res, next) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "Incomplete Data Received" });
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, medium, or high" });
  }
  next();
};

const validateUpdateData = (req, res, next) => {
  const { priority } = req.body;
  if (priority && !["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, medium, or high" });
  }
  next();
};

module.exports = { validateTaskData, validateUpdateData };
