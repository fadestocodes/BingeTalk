import React, { createContext, useState, useContext } from 'react';

const UserDBContext = createContext();

export const useUserDB = () => useContext(UserDBContext);

export const UserDBProvider = ({ children }) => {
  const [userDB, setUserDB] = useState(null);

  const updateUserDB = (userData) => {
    setUserDB(userData);
  };

  return (
    <UserDBContext.Provider value={{ userDB, updateUserDB }}>
      {children}
    </UserDBContext.Provider>
  );
};
