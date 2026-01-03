import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

// Storage keys for localStorage persistence
const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  CURRENT_USER: 'taskflow_current_user',
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get users from localStorage
const getStoredUsers = (): Record<string, { user: User; password: string }> => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : {};
};

// Helper to save users to localStorage
const saveUsers = (users: Record<string, { user: User; password: string }>) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function with email/password validation
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const { email, password } = credentials;
    const users = getStoredUsers();
    
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord) {
      toast({
        title: "Login failed",
        description: "No account found with this email address.",
        variant: "destructive",
      });
      return false;
    }
    
    if (userRecord.password !== password) {
      toast({
        title: "Login failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    // Save current user session
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userRecord.user));
    
    setAuthState({
      user: userRecord.user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userRecord.user.name}`,
    });
    
    return true;
  }, []);

  // Register function with validation
  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    const { email, password, confirmPassword, name } = credentials;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate password strength
    if (password.length < 6) {
      toast({
        title: "Registration failed",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users[email.toLowerCase()]) {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      createdAt: new Date(),
    };
    
    // Save to users storage
    users[email.toLowerCase()] = { user: newUser, password };
    saveUsers(users);
    
    // Log in the new user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    toast({
      title: "Account created!",
      description: `Welcome to TaskFlow, ${name}!`,
    });
    
    return true;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
