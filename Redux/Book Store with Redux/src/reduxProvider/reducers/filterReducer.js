import { SET_FILTER } from "../actions/filterActions";

const initialState = {
  author: "",
  genre: "",
  status: "all", 
};

function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, [action.payload.filterType]: action.payload.value };

    default:
      return state;
  }
}

export default filterReducer;
