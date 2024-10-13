import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const register = async values => {
    try {
      setIsLoading(true);
      await axios.post('/api/register', values);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      await axios.post('/api/login', {
        email,
        password
      });
      setUser({ email });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const aboutMe = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/me');
      setUser(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const res = await axios.post('/api/logout');
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        aboutMe,
        isLoading,
        setUser,
        user,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

