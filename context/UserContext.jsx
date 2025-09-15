
import React, { createContext, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // You can add user state and logic here
  const user = { name: 'Guest' }; // Example user

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
