
import React from "react";
import { useForm } from "../hooks/useForm";

export default function SearchBar() {
  const { values, handleChange } = useForm({ query: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    alert("Searching for: " + values.query);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        name="query"
        placeholder="Search..."
        value={values.query}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
}
