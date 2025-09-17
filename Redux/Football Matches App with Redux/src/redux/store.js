import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
// import thunk from ''
import { matchesReducer } from "./reducers/matchReducer";
import { favoritesReducer } from "./reducers/favoriteReducer";
import { filtersReducer } from "./reducers/filterReducer";

const rootReducer = combineReducers({
  matches: matchesReducer,
  favorites: favoritesReducer,
  filters: filtersReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
