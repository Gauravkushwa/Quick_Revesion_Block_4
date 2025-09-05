import React, { useState } from "react";
import "./TaskManager.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  const addTask = () => {
    if (title.trim() === "") return;
    const newTask = { id: Date.now(), title: title.trim(), priority, completed: false };
    const updatedTasks = [...tasks, newTask].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
    setTasks(updatedTasks);
    setTitle("");
    setPriority("Medium");
  };

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>
      <div className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`task-item ${task.priority === "High" ? "high-priority" : ""}`}
          >
            <span
              className={task.completed ? "completed" : ""}
              onClick={() => toggleComplete(task.id)}
            >
              {task.title} ({task.priority})
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
