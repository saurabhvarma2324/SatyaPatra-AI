import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('satyapatra_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Failed to load user session:', err.message);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('satyapatra_token', res.data.token);
      localStorage.setItem('satyapatra_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    if (res.data?.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('satyapatra_token', res.data.token);
      localStorage.setItem('satyapatra_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const quickDemoLogin = async (role = 'officer') => {
    let email = 'officer@satyapatra.gov.in';
    if (role === 'admin') email = 'admin@satyapatra.gov.in';
    if (role === 'applicant') email = 'applicant@satyapatra.gov.in';

    return await login(email, 'Password@123');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('satyapatra_token');
    localStorage.removeItem('satyapatra_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
