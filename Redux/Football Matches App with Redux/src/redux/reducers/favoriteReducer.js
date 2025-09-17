const initialFavorites = {
    favorites: [],
  };
  
  export const favoritesReducer = (state = initialFavorites, action) => {
    switch (action.type) {
      case "ADD_FAVORITE":
        return { ...state, favorites: [...state.favorites, action.payload] };
      case "REMOVE_FAVORITE":
        return {
          ...state,
          favorites: state.favorites.filter(fav => fav.id !== action.payload),
        };
      default:
        return state;
    }
  };
  