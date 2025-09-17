import React, { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./reduxProvider/store";
import { addBook, toggleRead, editBook, deleteBook } from "./reduxProvider/actions/bookAction";
import { setFilter } from "./reduxProvider/actions/filterActions";

function BookLibrary() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books);
  const filters = useSelector((state) => state.filters);

  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" });

  // Filter books
  const filteredBooks = books.filter((book) => {
    const byAuthor = filters.author ? book.author.includes(filters.author) : true;
    const byGenre = filters.genre ? book.genre.includes(filters.genre) : true;
    const byStatus =
      filters.status === "all" ? true : book.status === filters.status;
    return byAuthor && byGenre && byStatus;
  });

  const handleAddBook = () => {
    if (newBook.title && newBook.author && newBook.genre) {
      dispatch(addBook(newBook));
      setNewBook({ title: "", author: "", genre: "" });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>📚 Redux Book Library</h2>

      {/* Add new book */}
      <input
        placeholder="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />
      <input
        placeholder="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />
      <input
        placeholder="Genre"
        value={newBook.genre}
        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
      />
      <button onClick={handleAddBook}>Add Book</button>

      {/* Filters */}
      <div style={{ marginTop: "20px" }}>
        <h4>Filters</h4>
        <input
          placeholder="Filter by Author"
          onChange={(e) => dispatch(setFilter("author", e.target.value))}
        />
        <input
          placeholder="Filter by Genre"
          onChange={(e) => dispatch(setFilter("genre", e.target.value))}
        />
        <select
          onChange={(e) => dispatch(setFilter("status", e.target.value))}
        >
          <option value="all">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {/* Book list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredBooks.map((book) => (
          <li key={book.id} style={{ margin: "10px 0", borderBottom: "1px solid #ccc" }}>
            <strong>{book.title}</strong> by {book.author} ({book.genre})  
            <em> [{book.status}]</em>
            <br />
            <button onClick={() => dispatch(toggleRead(book.id))}>
              Toggle Read
            </button>
            <button
              onClick={() =>
                dispatch(editBook(book.id, { title: book.title + " (Updated)" }))
              }
            >
              Edit
            </button>
            <button onClick={() => dispatch(deleteBook(book.id))}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Debug: show full Redux state */}
      <pre>{JSON.stringify({ books, filters }, null, 2)}</pre>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BookLibrary />
    </Provider>
  );
}
