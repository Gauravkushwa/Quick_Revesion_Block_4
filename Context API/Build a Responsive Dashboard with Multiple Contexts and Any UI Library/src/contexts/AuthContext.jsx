import React, { createContext, useState } from 'react'

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [isLoogged, setIsLogged] = useState(false);
    const toggleLogged = setIsLogged(() => isLoogged === false ? "LogOut" : "LogIn")
  return (
    <div>
      <AuthContext.Provider value={{isLoogged, toggleLogged}}>
        {children}
      </AuthContext.Provider>
    </div>
  )
}

