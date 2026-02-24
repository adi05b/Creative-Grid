// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logout as logoutService } from '../services/authService';

// User type definition
interface User {
  id: string;
  fullname: string;
  email: string;
  profileImageUrl: string;
}

// Auth state type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context type
interface AuthContextType extends AuthState {
  login: (userData: User) => void;
  logout: () => void;
}

// Default state
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

// Create context
const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => {},
  logout: () => {}
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Load user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await getCurrentUser();
        
        if (response && response.status === 'success' && response.data) {
          console.log('User authenticated:', response.data);
          setAuthState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          console.log('User not authenticated');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData: User) => {
    console.log('Logging in user:', userData);
    setAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false
    });
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutService();
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  // Add this to debug your auth state
  console.log('AuthContext current state:', authState);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};