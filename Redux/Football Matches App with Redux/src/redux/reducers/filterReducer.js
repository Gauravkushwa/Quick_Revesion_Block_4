const initialFilters = {
    searchQuery: "",
    team: "",
    date: "",
    outcome: "",
  };
  
  export const filtersReducer = (state = initialFilters, action) => {
    switch (action.type) {
      case "SET_FILTERS":
        return { ...state, ...action.payload };
      case "CLEAR_FILTERS":
        return initialFilters;
      default:
        return state;
    }
  };
  