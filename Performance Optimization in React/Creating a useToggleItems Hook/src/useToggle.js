
import { useState } from "react";

export function useToggleItems(initialValue = [], initialPosition = 0) {
  if (!Array.isArray(initialValue) || initialValue.length === 0) {
    throw new Error("useToggleItems requires a non-empty array as initialValue");
  }

  const [index, setIndex] = useState(
    initialPosition >= 0 && initialPosition < initialValue.length
      ? initialPosition
      : 0
  );

  const toggleState = () => {
    setIndex((prevIndex) => (prevIndex + 1) % initialValue.length);
  };

  return [initialValue[index], toggleState];
}
