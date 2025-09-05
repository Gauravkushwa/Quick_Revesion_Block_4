import React, { useState } from 'react';

function TodoList() {
  // 1️⃣ State for tasks and input
  const [tasks, setTasks] = useState(['Buy milk', 'Study React']);
  const [input, setInput] = useState('');

  // 2️⃣ Add Task
  const addTask = () => {
    const trimmed = input.trim();
    if (trimmed === '') return;
    setTasks([...tasks, trimmed]);
    setInput('');
  };

  // 3️⃣ Clear All
  const clearAll = () => {
    setTasks([]);
  };

  return (
    <div style={styles.container}>
      <h1>📝 Todo List</h1>

      {/* Input */}
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter new task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addBtn}>
          Add
        </button>
        <button onClick={clearAll} style={styles.clearBtn}>
          Clear All
        </button>
      </div>

      {/* Task List */}
      <ul style={styles.list}>
        {tasks.length === 0 ? (
          <p style={styles.empty}>No tasks available.</p>
        ) : (
          tasks.map((task, index) => (
            <li key={index} style={styles.listItem}>
              {task}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    flex: '1',
    minWidth: '180px',
  },
  addBtn: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '10px',
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  empty: {
    color: '#777',
    fontStyle: 'italic',
  },
};

export default TodoList;