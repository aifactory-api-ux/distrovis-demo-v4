import { useState, useEffect, useCallback } from 'react';
import { login as loginApi } from '../api/auth';
import { AuthRequest } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi({ email, password } as AuthRequest);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  return { user, token, loading, error, login, logout };
};