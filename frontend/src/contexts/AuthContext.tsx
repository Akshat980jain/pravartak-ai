import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, AuthState, LoginCredentials, ROLE_CONFIGS } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Mock user data for demonstration
  const mockUsers: Record<string, User> = {
    "9876543210": {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      mobile: "9876543210",
      aadhaar: "123456789012",
      role: "victim_beneficiary",
      permissions: ROLE_CONFIGS.victim_beneficiary.permissions,
    },
    "9876543211": {
      id: "2",
      name: "District Officer Singh",
      email: "do@district.gov.in",
      mobile: "9876543211",
      role: "district_officer",
      permissions: ROLE_CONFIGS.district_officer.permissions,
      department: "Social Welfare",
      district: "Mumbai",
      state: "Maharashtra",
    },
    "9876543212": {
      id: "3",
      name: "State Welfare Officer",
      email: "swo@maharashtra.gov.in",
      mobile: "9876543212",
      role: "state_welfare_officer",
      permissions: ROLE_CONFIGS.state_welfare_officer.permissions,
      department: "Social Welfare",
      state: "Maharashtra",
    },
    "9876543213": {
      id: "4",
      name: "Financial Officer",
      email: "fo@mosje.gov.in",
      mobile: "9876543213",
      role: "financial_officer",
      permissions: ROLE_CONFIGS.financial_officer.permissions,
      department: "Finance",
    },
    "9876543214": {
      id: "5",
      name: "Central Admin",
      email: "admin@mosje.gov.in",
      mobile: "9876543214",
      role: "central_ministry_admin",
      permissions: ROLE_CONFIGS.central_ministry_admin.permissions,
      department: "MoSJE",
    },
    "9876543215": {
      id: "6",
      name: "Grievance Officer",
      email: "grievance@mosje.gov.in",
      mobile: "9876543215",
      role: "grievance_officer",
      permissions: ROLE_CONFIGS.grievance_officer.permissions,
      department: "Customer Support",
    },
    "9876543216": {
      id: "7",
      name: "System Admin",
      email: "sysadmin@mosje.gov.in",
      mobile: "9876543216",
      role: "system_admin",
      permissions: ROLE_CONFIGS.system_admin.permissions,
      department: "IT",
    },
    "9876543217": {
      id: "8",
      name: "Auditor",
      email: "auditor@mosje.gov.in",
      mobile: "9876543217",
      role: "auditor",
      permissions: ROLE_CONFIGS.auditor.permissions,
      department: "Audit",
    },
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("dbt_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("dbt_user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers[credentials.mobile || ""];
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify role matches
      if (user.role !== credentials.role) {
        throw new Error("Role mismatch");
      }

      localStorage.setItem("dbt_user", JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("dbt_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!authState.user) return false;
    return authState.user.role === role;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
