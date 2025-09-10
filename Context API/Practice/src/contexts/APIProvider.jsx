import React, { createContext, useState } from 'react'

export const DataContext = createContext();

export const APIProvider = ({children}) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: false
  })

  const fetchData = async() =>{
    setState({...state, loading: true, data: null, error: false});
    try {
      const res = await fetch('https://fakestoreapi.com/users');
      const result = await res.json();
      console.log("Data is Showing", result);
      setState({...state, loading: false, data: result, error: false})
    } catch (error) {
      setState({...state, loading: false, data: null, error: error.message})
    }
  }
  return (
    <div>
      <DataContext.Provider value={{state, fetchData}}>
        {children}
      </DataContext.Provider>
    </div>
  )
}


