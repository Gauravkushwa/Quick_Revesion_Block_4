import React, { createContext, useState } from 'react'

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(false);
  return (
    <div>
      <AuthContext.Provider value={{auth, setAuth}}>
        {children}
      </AuthContext.Provider>
    </div>
  )
};

