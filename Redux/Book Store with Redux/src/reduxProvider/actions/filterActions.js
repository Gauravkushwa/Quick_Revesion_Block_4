export const SET_FILTER = "SET_FILTER";

export const setFilter = (filterType, value) => ({
  type: SET_FILTER,
  payload: { filterType, value },
});
