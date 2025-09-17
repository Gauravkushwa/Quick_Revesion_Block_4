const initialState = {
    isLoading: false,
    isError: false,
    footballMatches: [],
  };
  
  export const matchesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_MATCHES_REQUEST":
        return { ...state, isLoading: true, isError: false };
      case "FETCH_MATCHES_SUCCESS":
        return { ...state, isLoading: false, footballMatches: action.payload };
      case "FETCH_MATCHES_FAILURE":
        return { ...state, isLoading: false, isError: true };
      default:
        return state;
    }
  };
  