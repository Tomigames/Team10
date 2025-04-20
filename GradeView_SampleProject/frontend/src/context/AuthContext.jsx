import React, { createContext, useState, useEffect } from 'react';
import api, { setUserIdHeader } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load saved user
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      setUser(u);
      setUserIdHeader(u.userId);
    }
  }, []);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    setUserIdHeader(data.userId);
  };

  const signup = async (username, password) => {
    const data = await api.signup(username, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    setUserIdHeader(data.userId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setUserIdHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
