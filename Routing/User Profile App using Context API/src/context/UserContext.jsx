import React, { createContext, useState } from 'react';

// Create Context
export const UserContext = createContext();

// Provider Component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Gaurav Kushwaha',
    email: 'gaurav@example.com',
  });

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
