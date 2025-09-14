import React, { useEffect, useState } from "react";

export default function TodosPagination() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
      setLoading(false);
    };

    fetchTodos();
  }, []);
  const totalPages = Math.ceil(todos.length / todosPerPage);
  const indexOfLast = currentPage * todosPerPage;
  const indexOfFirst = indexOfLast - todosPerPage;
  const currentTodos = todos.slice(indexOfFirst, indexOfLast);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Todos with Pagination
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <ul className="space-y-2">
            {currentTodos.map((todo) => (
              <li
                key={todo.id}
                className="p-3 border rounded-md shadow-sm flex justify-between"
              >
                <span>{todo.title}</span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    todo.completed ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {todo.completed ? "Done" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-4 py-2 rounded ${
                  currentPage === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
