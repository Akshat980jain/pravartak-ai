// API Service for DBT Portal
// This is a mock API service that simulates backend calls

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Application {
  id: string;
  beneficiaryName: string;
  aadhaarNumber: string;
  mobileNumber: string;
  amount: number;
  status: "pending" | "verified" | "approved" | "rejected" | "disbursed";
  submittedDate: string;
  verifiedDate?: string;
  approvedDate?: string;
  disbursedDate?: string;
  remarks?: string;
  documents: string[];
}

export interface Payment {
  id: string;
  applicationId: string;
  beneficiaryName: string;
  amount: number;
  bankAccount: string;
  ifscCode: string;
  status: "pending" | "processing" | "completed" | "failed";
  transactionId?: string;
  disbursedDate?: string;
  remarks?: string;
}

export interface Complaint {
  id: string;
  complainantName: string;
  mobileNumber: string;
  email?: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  submittedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
  resolution?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

// Mock data
const mockApplications: Application[] = [
  {
    id: "DBT2025001234",
    beneficiaryName: "Rajesh Kumar",
    aadhaarNumber: "123456789012",
    mobileNumber: "9876543210",
    amount: 50000,
    status: "pending",
    submittedDate: "2025-01-15",
    documents: ["aadhaar.pdf", "income_certificate.pdf"],
  },
  {
    id: "DBT2025001235",
    beneficiaryName: "Meera Devi",
    aadhaarNumber: "234567890123",
    mobileNumber: "9876543211",
    amount: 75000,
    status: "approved",
    submittedDate: "2025-01-14",
    verifiedDate: "2025-01-15",
    approvedDate: "2025-01-16",
    documents: ["aadhaar.pdf", "bank_passbook.pdf"],
  },
];

const mockPayments: Payment[] = [
  {
    id: "PAY001",
    applicationId: "DBT2025001234",
    beneficiaryName: "Rajesh Kumar",
    amount: 50000,
    bankAccount: "1234567890",
    ifscCode: "SBIN0001234",
    status: "pending",
  },
  {
    id: "PAY002",
    applicationId: "DBT2025001235",
    beneficiaryName: "Meera Devi",
    amount: 75000,
    bankAccount: "9876543210",
    ifscCode: "HDFC0005678",
    status: "completed",
    transactionId: "TXN123456789",
    disbursedDate: "2025-01-16",
  },
];

const mockComplaints: Complaint[] = [
  {
    id: "COMP001",
    complainantName: "Suresh Yadav",
    mobileNumber: "9876543212",
    email: "suresh@example.com",
    subject: "Application Status Not Updated",
    description: "My application has been pending for more than 30 days without any update.",
    status: "open",
    priority: "medium",
    submittedDate: "2025-01-10",
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "AUDIT001",
    userId: "user123",
    userName: "District Officer Singh",
    action: "VERIFY_APPLICATION",
    resource: "DBT2025001234",
    timestamp: "2025-01-15T10:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    details: { status: "verified", remarks: "Documents verified successfully" },
  },
];

// API Service Class
class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  // Generic API call method
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Authentication APIs
  async login(credentials: {
    mobile?: string;
    aadhaar?: string;
    otp?: string;
    role: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        user: {
          id: "1",
          name: "Test User",
          mobile: credentials.mobile,
          role: credentials.role,
        },
        token: "mock-jwt-token",
      },
    };
  }

  async logout(): Promise<ApiResponse<null>> {
    return {
      success: true,
      data: null,
      message: "Logged out successfully",
    };
  }

  // Application APIs
  async getApplications(filters?: {
    status?: string;
    role?: string;
    userId?: string;
  }): Promise<ApiResponse<Application[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredApplications = [...mockApplications];
    
    if (filters?.status) {
      filteredApplications = filteredApplications.filter(
        app => app.status === filters.status
      );
    }
    
    return {
      success: true,
      data: filteredApplications,
    };
  }

  async getApplication(id: string): Promise<ApiResponse<Application>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const application = mockApplications.find(app => app.id === id);
    
    if (!application) {
      return {
        success: false,
        data: null as Application,
        error: "Application not found",
      };
    }
    
    return {
      success: true,
      data: application,
    };
  }

  async updateApplicationStatus(
    id: string,
    status: string,
    remarks?: string
  ): Promise<ApiResponse<Application>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const application = mockApplications.find(app => app.id === id);
    
    if (!application) {
      return {
        success: false,
        data: null as Application,
        error: "Application not found",
      };
    }
    
    application.status = status as any;
    if (remarks) application.remarks = remarks;
    
    const now = new Date().toISOString().split('T')[0];
    if (status === "verified") application.verifiedDate = now;
    if (status === "approved") application.approvedDate = now;
    if (status === "disbursed") application.disbursedDate = now;
    
    return {
      success: true,
      data: application,
      message: "Application status updated successfully",
    };
  }

  // Payment APIs
  async getPayments(filters?: {
    status?: string;
    applicationId?: string;
  }): Promise<ApiResponse<Payment[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredPayments = [...mockPayments];
    
    if (filters?.status) {
      filteredPayments = filteredPayments.filter(
        payment => payment.status === filters.status
      );
    }
    
    if (filters?.applicationId) {
      filteredPayments = filteredPayments.filter(
        payment => payment.applicationId === filters.applicationId
      );
    }
    
    return {
      success: true,
      data: filteredPayments,
    };
  }

  async processPayment(paymentId: string): Promise<ApiResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const payment = mockPayments.find(p => p.id === paymentId);
    
    if (!payment) {
      return {
        success: false,
        data: null as Payment,
        error: "Payment not found",
      };
    }
    
    payment.status = "processing";
    
    // Simulate completion
    setTimeout(() => {
      payment.status = "completed";
      payment.transactionId = `TXN${Date.now()}`;
      payment.disbursedDate = new Date().toISOString().split('T')[0];
    }, 3000);
    
    return {
      success: true,
      data: payment,
      message: "Payment processing initiated",
    };
  }

  // Complaint APIs
  async getComplaints(filters?: {
    status?: string;
    priority?: string;
  }): Promise<ApiResponse<Complaint[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredComplaints = [...mockComplaints];
    
    if (filters?.status) {
      filteredComplaints = filteredComplaints.filter(
        complaint => complaint.status === filters.status
      );
    }
    
    return {
      success: true,
      data: filteredComplaints,
    };
  }

  async updateComplaintStatus(
    id: string,
    status: string,
    resolution?: string
  ): Promise<ApiResponse<Complaint>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const complaint = mockComplaints.find(c => c.id === id);
    
    if (!complaint) {
      return {
        success: false,
        data: null as Complaint,
        error: "Complaint not found",
      };
    }
    
    complaint.status = status as any;
    if (resolution) complaint.resolution = resolution;
    if (status === "resolved") complaint.resolvedDate = new Date().toISOString().split('T')[0];
    
    return {
      success: true,
      data: complaint,
      message: "Complaint status updated successfully",
    };
  }

  // Audit APIs
  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<AuditLog[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLogs = [...mockAuditLogs];
    
    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }
    
    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }
    
    return {
      success: true,
      data: filteredLogs,
    };
  }

  async logAuditEvent(event: Omit<AuditLog, "id" | "timestamp">): Promise<ApiResponse<AuditLog>> {
    const auditLog: AuditLog = {
      ...event,
      id: `AUDIT${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    mockAuditLogs.push(auditLog);
    
    return {
      success: true,
      data: auditLog,
    };
  }

  // Dashboard APIs
  async getDashboardStats(role: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const stats = {
      victim_beneficiary: {
        totalApplications: 3,
        approvedApplications: 1,
        pendingApplications: 2,
        totalAmountReceived: 75000,
      },
      district_officer: {
        applicationsToVerify: 45,
        verifiedToday: 12,
        forwardedToday: 8,
        districtCoverage: 85,
      },
      state_welfare_officer: {
        applicationsToApprove: 156,
        approvedToday: 23,
        stateCoverage: 92,
        totalSanctioned: 21000000,
      },
      financial_officer: {
        paymentsPending: 89,
        processedToday: 34,
        totalDisbursed: 42000000,
        successRate: 98.5,
      },
      central_ministry_admin: {
        totalApplications: 1245,
        activeStates: 28,
        systemHealth: 99.9,
        totalDisbursed: 452000000,
      },
    };
    
    return {
      success: true,
      data: stats[role as keyof typeof stats] || {},
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
