import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adapterToClient } from '../helpers/adapter'

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

  async function validUser(code) {
    try {
      setIsLoading(true);
      await axios.post('/api/me', {
        code,
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  }

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/login', {
        email,
        password
      });
      setUser(adapterToClient(response.data));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  async function newPassword(values) {
    try {
      setIsLoading(true);
      const data = {
        old_password: values.old_password,
        password: values.password,
      }
      await axios.put('/api/password', data);      
      setIsLoading(false);      
    } catch (err) {
      setIsLoading(false);
      throw err
    }
  }

  const updateUser = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.put('/api/me', data);
      setUser(adapterToClient(res.data));      
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw err
    }
  };
  
  const aboutMe = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/me');
      setUser(adapterToClient(res.data));
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      return { data: null };
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
        updateUser,
        isLoading,
        setUser,
        user,
        newPassword,
        validUser,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

