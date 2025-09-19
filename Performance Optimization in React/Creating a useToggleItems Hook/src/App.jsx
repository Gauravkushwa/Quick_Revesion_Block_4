
import React from "react";
import { useToggleItems } from "./useToggle";

export default function App() {
  const [state, toggleState] = useToggleItems(["A", "B", "C"], 1);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🔄 Current State: {state}</h2>
      <button onClick={toggleState}>Toggle</button>
    </div>
  );
}
