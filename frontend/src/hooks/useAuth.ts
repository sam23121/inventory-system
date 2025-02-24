import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { api, authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setAuth({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          localStorage.removeItem('token');
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    setAuth({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = async () => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true }));
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
      // redirect to login page
      window.location.href = '/login';
    }
  };

  return { ...auth, login, logout };
};