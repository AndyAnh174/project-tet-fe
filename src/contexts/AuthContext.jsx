import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khởi tạo user từ localStorage nếu có
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      console.log('Login attempt in AuthContext');
      const userData = await authService.login(username, password);
      console.log('Login response:', userData);
      
      if (!userData || !userData.username) {
        throw new Error('Invalid user data received');
      }
      
      // Lưu user vào state và localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Kiểm tra token khi component mount
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          setLoading(false);
          return;
        }

        const isValid = await authService.validateToken();
        if (!isValid.valid) {
          console.log('Token invalid, logging out');
          logout();
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 