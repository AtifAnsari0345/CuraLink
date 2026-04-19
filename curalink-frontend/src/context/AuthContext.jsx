/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-9la1.onrender.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('curalink_token');
    localStorage.removeItem('curalink_user');
    delete axios.defaults.headers.common.Authorization;
    window.location.href = '/';
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let storedUser = null;
        let storedToken = null;

        try {
          const savedUser = localStorage.getItem('curalink_user');
          const savedToken = localStorage.getItem('curalink_token');
          if (savedUser) storedUser = JSON.parse(savedUser);
          if (savedToken && savedToken.split('.').length === 3) storedToken = savedToken;
        } catch (error) {
          localStorage.removeItem('curalink_user');
          localStorage.removeItem('curalink_token');
        }

        if (storedToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          setToken(storedToken);

          if (storedUser) {
            setUser(storedUser);
          } else {
            try {
              const res = await axios.get(`${BASE_URL}/api/auth/me`);
              setUser(res.data);
              localStorage.setItem('curalink_user', JSON.stringify(res.data));
            } catch (error) {
              console.error('Failed to fetch user:', error);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  const login = async (email, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('curalink_token', newToken);
    localStorage.setItem('curalink_user', JSON.stringify(newUser));
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    return newUser;
  };

  const register = async (username, email, password, role) => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, { username, email, password, role });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('curalink_token', newToken);
    localStorage.setItem('curalink_user', JSON.stringify(newUser));
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    return newUser;
  };

  const updateProfile = async (profileData) => {
    const res = await axios.put(`${BASE_URL}/api/auth/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedUser = res.data;
    setUser(updatedUser);
    localStorage.setItem('curalink_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  }), [user, token, isLoading, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
