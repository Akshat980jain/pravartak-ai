import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Eye, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Filter,
  Calendar,
  Users,
  DollarSign,
  Shield,
  BarChart3,
  PieChart
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  status: "success" | "warning" | "error";
  ipAddress: string;
  userAgent: string;
}

interface ComplianceReport {
  id: string;
  title: string;
  category: string;
  status: "compliant" | "non_compliant" | "pending";
  score: number;
  lastChecked: string;
  issues: string[];
  recommendations: string[];
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalApplications: number;
  pendingApplications: number;
  totalPayments: number;
  successfulPayments: number;
  systemUptime: number;
  averageResponseTime: number;
}

const AuditSystem = () => {
  const { user, hasPermission } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "AUD001",
      action: "Application Approved",
      user: "State Welfare Officer",
      role: "state_welfare_officer",
      timestamp: "2025-01-16 14:30:25",
      details: "Approved application DBT2025001234 for Rajesh Kumar",
      status: "success",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      id: "AUD002",
      action: "Payment Processed",
      user: "Financial Officer",
      role: "financial_officer",
      timestamp: "2025-01-16 14:25:10",
      details: "Processed payment of ₹50,000 to account ending 7890",
      status: "success",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      id: "AUD003",
      action: "Failed Login Attempt",
      user: "Unknown",
      role: "unknown",
      timestamp: "2025-01-16 14:20:45",
      details: "Multiple failed login attempts from IP 203.0.113.1",
      status: "error",
      ipAddress: "203.0.113.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      id: "AUD004",
      action: "Document Verification",
      user: "District Officer",
      role: "district_officer",
      timestamp: "2025-01-16 14:15:30",
      details: "Verified documents for application DBT2025001235",
      status: "success",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      id: "AUD005",
      action: "System Configuration Change",
      user: "System Admin",
      role: "system_admin",
      timestamp: "2025-01-16 14:10:15",
      details: "Updated payment gateway configuration",
      status: "warning",
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  ]);

  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([
    {
      id: "COMP001",
      title: "Data Privacy Compliance",
      category: "Privacy & Security",
      status: "compliant",
      score: 95,
      lastChecked: "2025-01-15",
      issues: [],
      recommendations: ["Implement additional encryption for sensitive data"]
    },
    {
      id: "COMP002",
      title: "Payment Processing Compliance",
      category: "Financial",
      status: "non_compliant",
      score: 78,
      lastChecked: "2025-01-14",
      issues: ["Missing audit trail for 3 transactions", "Incomplete KYC verification for 2 beneficiaries"],
      recommendations: ["Implement comprehensive audit logging", "Strengthen KYC verification process"]
    },
    {
      id: "COMP003",
      title: "Access Control Compliance",
      category: "Security",
      status: "pending",
      score: 0,
      lastChecked: "2025-01-16",
      issues: [],
      recommendations: []
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 1245,
    activeUsers: 89,
    totalApplications: 3456,
    pendingApplications: 234,
    totalPayments: 2890,
    successfulPayments: 2756,
    systemUptime: 99.9,
    averageResponseTime: 1.2
  });

  const [filters, setFilters] = useState({
    dateRange: "7d",
    action: "all",
    status: "all",
    user: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filters.action !== "all" && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
    if (filters.status !== "all" && log.status !== filters.status) return false;
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    return true;
  });

  const generateReport = async (type: string) => {
    toast.success(`Generating ${type} report...`);
    // Simulate report generation
    setTimeout(() => {
      toast.success(`${type} report generated successfully!`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalApplications.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((systemMetrics.successfulPayments / systemMetrics.totalPayments) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {hasPermission("system_admin") && <TabsTrigger value="system">System Monitor</TabsTrigger>}
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>System activity and user actions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateReport("Audit")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Input
                    id="action"
                    placeholder="Filter by action..."
                    value={filters.action === "all" ? "" : filters.action}
                    onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value || "all" }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="user">User</Label>
                  <Input
                    id="user"
                    placeholder="Filter by user..."
                    value={filters.user}
                    onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                  />
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-medium transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{log.action}</h3>
                            <Badge className={getStatusColor(log.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(log.status)}
                                {log.status}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {log.user} ({log.role})
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {log.timestamp}
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {log.ipAddress}
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Audit Log Details</DialogTitle>
                              <DialogDescription>Log ID: {log.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Action</Label>
                                <p className="text-sm">{log.action}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">User</Label>
                                <p className="text-sm">{log.user} ({log.role})</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Timestamp</Label>
                                <p className="text-sm">{log.timestamp}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Details</Label>
                                <p className="text-sm">{log.details}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">IP Address</Label>
                                <p className="text-sm">{log.ipAddress}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">User Agent</Label>
                                <p className="text-sm text-xs break-all">{log.userAgent}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>System compliance and regulatory adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-medium transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge className={getComplianceColor(report.status)}>
                              {report.status.replace('_', ' ')}
                            </Badge>
                            {report.score > 0 && (
                              <Badge variant="outline">
                                Score: {report.score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Category: {report.category} • Last checked: {report.lastChecked}
                          </p>
                          {report.issues.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-red-600 mb-1">Issues Found:</p>
                              <ul className="text-sm text-red-600 list-disc list-inside">
                                {report.issues.map((issue, index) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {report.recommendations.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-blue-600 mb-1">Recommendations:</p>
                              <ul className="text-sm text-blue-600 list-disc list-inside">
                                {report.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Create comprehensive audit and compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-medium transition-smooth cursor-pointer" onClick={() => generateReport("Audit")}>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Audit Report</h3>
                    <p className="text-sm text-muted-foreground">Complete system audit log</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-medium transition-smooth cursor-pointer" onClick={() => generateReport("Compliance")}>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Compliance Report</h3>
                    <p className="text-sm text-muted-foreground">Regulatory compliance status</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-medium transition-smooth cursor-pointer" onClick={() => generateReport("Financial")}>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Financial Report</h3>
                    <p className="text-sm text-muted-foreground">Payment and disbursement summary</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-medium transition-smooth cursor-pointer" onClick={() => generateReport("Performance")}>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Performance Report</h3>
                    <p className="text-sm text-muted-foreground">System performance metrics</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasPermission("system_admin") && (
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
                <CardDescription>Real-time system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">System Health</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Disk Usage</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">{systemMetrics.averageResponseTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Connections</span>
                        <span className="text-sm font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database Connections</span>
                        <span className="text-sm font-medium">45/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Error Rate</span>
                        <span className="text-sm font-medium text-green-600">0.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AuditSystem;
