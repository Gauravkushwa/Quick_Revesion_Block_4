const Task = require("../models/task.model");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const exists = await Task.findOne({ title });
    if (exists) return res.status(409).json({ message: "Task title must be unique" });

    const task = new Task({ title, description, priority, dueDate });
    await task.save();
    res.status(201).json({ message: "Task created", data: task });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { priority, isCompleted } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";
    const tasks = await Task.find(filter).lean();
    res.status(200).json({ message: "Tasks retrieved", count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.isCompleted === true) {
      updates.completionDate = new Date();
    }
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", data: task });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;
    if (!priority) return res.status(400).json({ message: "Priority filter required" });
    const result = await Task.deleteMany({ priority });
    res.status(200).json({ message: `${result.deletedCount} tasks deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTasks };
