import React, { useState } from "react";
import { Provider, connect } from "react-redux";
import store from "./redux/store";
import { addTodo, toggleTodo, deleteTodo } from "./redux/action";

function TodoApp({ todos, addTodo, toggleTodo, deleteTodo }) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      addTodo(title);
      setTitle("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Redux Todo App</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo..."
      />
      <button onClick={handleAdd}>Add Todo</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ margin: "10px 0" }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.status ? "line-through" : "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Display state in stringified format for debugging */}
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  );
}

// Map state and dispatch to props
const mapStateToProps = (state) => ({
  todos: state.todos,
});

const mapDispatchToProps = {
  addTodo,
  toggleTodo,
  deleteTodo,
};

const ConnectedTodoApp = connect(mapStateToProps, mapDispatchToProps)(TodoApp);

export default function App() {
  return (
    <Provider store={store}>
      <ConnectedTodoApp />
    </Provider>
  );
}
