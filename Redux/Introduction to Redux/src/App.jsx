// App.js
import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./reduxStore/store.js";
import { increment, decrement } from "./reduxStore/action.js";

function Counter() {
  const count = useSelector((state) => state.count); 
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Redux Counter App</h2>

      {/* Display state in stringified format */}
      <p>Current State: {JSON.stringify({ count })}</p>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())} style={{ marginLeft: "10px" }}>
        Decrement
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
