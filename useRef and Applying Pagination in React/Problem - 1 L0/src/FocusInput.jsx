import React, { useRef, useState } from "react";

export default function FocusInput() {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.backgroundColor = "#e0f7fa"; 
      setFocused(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">useRef Focus Example</h1>

      <input
        ref={inputRef}
        type="text"
        placeholder="Click button to focus"
        className="w-full px-3 py-2 border rounded-md outline-none"
      />

      <button
        onClick={handleFocus}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Focus Input
      </button>

      {focused && <p className="mt-3 text-green-600 font-medium">Focused!</p>}
    </div>
  );
}
