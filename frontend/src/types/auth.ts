export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  aadhaar?: string;
  role: UserRole;
  permissions: string[];
  department?: string;
  region?: string;
  state?: string;
  district?: string;
}

export type UserRole = 
  | "victim_beneficiary"
  | "district_officer" 
  | "state_welfare_officer"
  | "central_ministry_admin"
  | "financial_officer"
  | "grievance_officer"
  | "system_admin"
  | "auditor";

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
  scope: string;
  icon: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  victim_beneficiary: {
    id: "victim_beneficiary",
    name: "Victim / Beneficiary",
    description: "Apply, Track, Feedback",
    permissions: ["apply", "track", "feedback"],
    scope: "Self-only",
    icon: "👤"
  },
  district_officer: {
    id: "district_officer",
    name: "District Officer",
    description: "Verify & Forward",
    permissions: ["verify", "forward", "view_applications"],
    scope: "Regional",
    icon: "🏛️"
  },
  state_welfare_officer: {
    id: "state_welfare_officer",
    name: "State Welfare Officer",
    description: "Approve & Sanction",
    permissions: ["approve", "sanction", "view_state_applications"],
    scope: "State-wide",
    icon: "🏛️"
  },
  central_ministry_admin: {
    id: "central_ministry_admin",
    name: "Central Ministry Admin (MoSJE)",
    description: "Monitor & Audit",
    permissions: ["monitor", "audit", "view_all_applications", "generate_reports"],
    scope: "Nationwide",
    icon: "🏛️"
  },
  financial_officer: {
    id: "financial_officer",
    name: "Financial Officer",
    description: "Fund Disbursement",
    permissions: ["disburse_funds", "view_payments", "process_payments"],
    scope: "Transactional",
    icon: "💰"
  },
  grievance_officer: {
    id: "grievance_officer",
    name: "Grievance Officer",
    description: "Complaint Handling",
    permissions: ["handle_complaints", "view_grievances", "resolve_issues"],
    scope: "Support-based",
    icon: "🎧"
  },
  system_admin: {
    id: "system_admin",
    name: "System Admin",
    description: "Backend & API Maintenance",
    permissions: ["system_admin", "api_maintenance", "user_management"],
    scope: "Technical",
    icon: "⚙️"
  },
  auditor: {
    id: "auditor",
    name: "Auditor",
    description: "Compliance & Oversight",
    permissions: ["audit", "compliance_check", "view_reports"],
    scope: "Read-only",
    icon: "📊"
  }
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  mobile?: string;
  aadhaar?: string;
  otp?: string;
  role: UserRole;
}
