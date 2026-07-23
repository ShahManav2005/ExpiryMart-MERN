import { createContext, useState, useContext } from "react";
import api from '../api/axios'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  }

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);