import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username?: string;
  district?: string;
  loginTime: string;
  role: 'beneficiary' | 'district_officer' | 'admin';
  aadhaar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, district: string, role: 'beneficiary' | 'district_officer' | 'admin', aadhaar?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, district: string, role: 'beneficiary' | 'district_officer' | 'admin', aadhaar?: string, phone?: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication based on role
      let isValid = false;
      
      if (role === 'beneficiary') {
        isValid = aadhaar === "123456789012" && phone === "9876543210";
      } else if (role === 'district_officer') {
        isValid = username === "district_officer" && password === "password123";
      } else if (role === 'admin') {
        isValid = username === "admin" && password === "admin123";
      }
      
      if (isValid) {
        const userData: User = {
          username: role === 'beneficiary' ? undefined : username,
          district: role === 'beneficiary' ? undefined : district,
          loginTime: new Date().toISOString(),
          role,
          aadhaar: role === 'beneficiary' ? aadhaar : undefined,
          phone: role === 'beneficiary' ? phone : undefined
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
