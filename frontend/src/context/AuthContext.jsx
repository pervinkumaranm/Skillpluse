import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('sp_token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
      setProfile(res.data.data.profile);
    } catch (error) {
      localStorage.removeItem('sp_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token: newToken } = res.data.data;
    localStorage.setItem('sp_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { user: userData, token: newToken } = res.data.data;
    localStorage.setItem('sp_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    token,
    loading,
    login,
    register,
    logout,
    loadUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
