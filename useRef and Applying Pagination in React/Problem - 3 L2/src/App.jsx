

import './App.css'
import React, { useEffect, useState, useRef } from "react";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const currentPageRef = useRef(1); // store current page without causing re-render
  const [renderPage, setRenderPage] = useState(1); // for UI re-render

  const charactersPerPage = 10;

  // Fetch characters data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://rickandmortyapi.com/api/character");
        const data = await res.json();
        setCharacters(data.results); // first 20 characters
        setTotalPages(Math.ceil(data.results.length / charactersPerPage));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLast = currentPageRef.current * charactersPerPage;
  const indexOfFirst = indexOfLast - charactersPerPage;
  const currentCharacters = characters.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNum) => {
    currentPageRef.current = pageNum; // update ref
    setRenderPage(pageNum); // trigger UI update
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Rick and Morty Characters
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* Character grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {currentCharacters.map((char) => (
              <div
                key={char.id}
                className="p-3 rounded-xl shadow-md border text-center"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="rounded-full w-24 h-24 mx-auto"
                />
                <p className="mt-2 font-medium">{char.name}</p>
                <p className="text-sm text-gray-600">{char.species}</p>
              </div>
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-4 py-2 rounded-md border ${
                  currentPageRef.current === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
