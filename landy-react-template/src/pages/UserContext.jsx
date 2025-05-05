// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
    setIsLoading(false);
  }, []);

  const updateUser = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};