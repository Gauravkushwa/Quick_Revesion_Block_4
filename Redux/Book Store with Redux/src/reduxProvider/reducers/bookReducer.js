import { ADD_BOOK, TOGGLE_READ, EDIT_BOOK, DELETE_BOOK } from "../actions/bookAction";

const initialState = [];

function bookReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BOOK:
      return [...state, action.payload];

    case TOGGLE_READ:
      return state.map((book) =>
        book.id === action.payload
          ? { ...book, status: book.status === "read" ? "unread" : "read" }
          : book
      );

    case EDIT_BOOK:
      return state.map((book) =>
        book.id === action.payload.id
          ? { ...book, ...action.payload.updatedDetails }
          : book
      );

    case DELETE_BOOK:
      return state.filter((book) => book.id !== action.payload);

    default:
      return state;
  }
}

export default bookReducer;
