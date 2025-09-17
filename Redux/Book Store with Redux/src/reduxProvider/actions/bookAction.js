export const ADD_BOOK = "ADD_BOOK";
export const TOGGLE_READ = "TOGGLE_READ";
export const EDIT_BOOK = "EDIT_BOOK";
export const DELETE_BOOK = "DELETE_BOOK";

export const addBook = (book) => ({
  type: ADD_BOOK,
  payload: { ...book, id: Date.now(), status: "unread" },
});

export const toggleRead = (id) => ({
  type: TOGGLE_READ,
  payload: id,
});

export const editBook = (id, updatedDetails) => ({
  type: EDIT_BOOK,
  payload: { id, updatedDetails },
});

export const deleteBook = (id) => ({
  type: DELETE_BOOK,
  payload: id,
});
