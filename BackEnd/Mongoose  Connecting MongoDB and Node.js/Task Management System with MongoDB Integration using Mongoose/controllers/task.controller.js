const Task = require("../models/task.model");

// Create Task
const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Task created", data: task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

// Read Tasks (with optional filters)
const getTasks = async (req, res) => {
  try {
    const { status, dueDate } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filter);
    res.status(200).json({ count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", data: task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", data: task });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
