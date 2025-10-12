import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Users, FileText, TrendingUp, AlertCircle, CheckCircle, DollarSign, Shield, Settings, MessageSquare, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import PaymentIntegration from "@/components/PaymentIntegration";
import GrievanceSystem from "@/components/GrievanceSystem";
import AuditSystem from "@/components/AuditSystem";

const Dashboard = () => {
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const roleConfig = ROLE_CONFIGS[user.role];
  
  const recentApplications = [
    { id: "DBT2025001234", name: "Rajesh Kumar", status: "In Progress", date: "15 Jan 2025", amount: "₹50,000" },
    { id: "DBT2025001235", name: "Meera Devi", status: "Approved", date: "14 Jan 2025", amount: "₹75,000" },
    { id: "DBT2025001236", name: "Suresh Yadav", status: "Under Review", date: "13 Jan 2025", amount: "₹60,000" },
  ];

  const getRoleSpecificStats = () => {
    switch (user.role) {
      case "victim_beneficiary":
        return [
          { title: "My Applications", value: "3", icon: FileText, description: "Total submitted" },
          { title: "Approved", value: "1", icon: CheckCircle, description: "Benefits received" },
          { title: "Pending", value: "2", icon: AlertCircle, description: "Under review" },
          { title: "Amount Received", value: "₹75,000", icon: DollarSign, description: "This year" },
        ];
      case "district_officer":
        return [
          { title: "Applications to Verify", value: "45", icon: FileText, description: "Pending verification" },
          { title: "Verified Today", value: "12", icon: CheckCircle, description: "Completed" },
          { title: "Forwarded", value: "8", icon: TrendingUp, description: "To state level" },
          { title: "District Coverage", value: "85%", icon: Users, description: "Applications processed" },
        ];
      case "state_welfare_officer":
        return [
          { title: "Applications to Approve", value: "156", icon: FileText, description: "Pending approval" },
          { title: "Approved Today", value: "23", icon: CheckCircle, description: "Sanctioned" },
          { title: "State Coverage", value: "92%", icon: Users, description: "Districts covered" },
          { title: "Total Sanctioned", value: "₹2.1Cr", icon: DollarSign, description: "This month" },
        ];
      case "financial_officer":
        return [
          { title: "Payments Pending", value: "89", icon: DollarSign, description: "Awaiting disbursement" },
          { title: "Processed Today", value: "34", icon: CheckCircle, description: "Payments sent" },
          { title: "Total Disbursed", value: "₹4.2Cr", icon: TrendingUp, description: "This month" },
          { title: "Success Rate", value: "98.5%", icon: Shield, description: "Payment success" },
        ];
      case "central_ministry_admin":
        return [
          { title: "Total Applications", value: "1,245", icon: FileText, description: "Nationwide" },
          { title: "States Active", value: "28", icon: Users, description: "Participating states" },
          { title: "System Health", value: "99.9%", icon: Shield, description: "Uptime" },
          { title: "Total Disbursed", value: "₹45.2Cr", icon: DollarSign, description: "This quarter" },
        ];
      case "grievance_officer":
        return [
          { title: "Active Complaints", value: "23", icon: MessageSquare, description: "Requiring attention" },
          { title: "Resolved Today", value: "7", icon: CheckCircle, description: "Issues closed" },
          { title: "Response Time", value: "2.3 hrs", icon: TrendingUp, description: "Average" },
          { title: "Satisfaction", value: "94%", icon: Users, description: "User rating" },
        ];
      case "system_admin":
        return [
          { title: "System Status", value: "Online", icon: Shield, description: "All systems operational" },
          { title: "Active Users", value: "1,234", icon: Users, description: "Currently online" },
          { title: "API Calls", value: "45K", icon: TrendingUp, description: "Last hour" },
          { title: "Database", value: "Healthy", icon: CheckCircle, description: "Performance good" },
        ];
      case "auditor":
        return [
          { title: "Audit Reports", value: "12", icon: FileText, description: "Generated this month" },
          { title: "Compliance Score", value: "96%", icon: CheckCircle, description: "Overall rating" },
          { title: "Issues Found", value: "3", icon: AlertCircle, description: "Minor issues" },
          { title: "Recommendations", value: "8", icon: Eye, description: "Improvements suggested" },
        ];
      default:
        return [];
    }
  };

  const stats = getRoleSpecificStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome, {user.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-lg">{roleConfig.icon}</span>
                <p className="text-muted-foreground">{roleConfig.name}</p>
                <Badge variant="outline">{roleConfig.scope}</Badge>
              </div>
            </div>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground">{roleConfig.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            {hasPermission("apply") && <TabsTrigger value="my-applications">My Applications</TabsTrigger>}
            {hasPermission("view_applications") && <TabsTrigger value="applications">Applications</TabsTrigger>}
            {hasPermission("view_payments") && <TabsTrigger value="payments">Payments</TabsTrigger>}
            {hasPermission("handle_complaints") && <TabsTrigger value="complaints">Complaints</TabsTrigger>}
            {hasPermission("audit") && <TabsTrigger value="audit">Audit</TabsTrigger>}
            {hasPermission("system_admin") && <TabsTrigger value="system">System</TabsTrigger>}
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {hasPermission("apply") && (
            <TabsContent value="my-applications" className="space-y-4">
              <Card className="shadow-card border-border/50">
                <CardHeader className="border-b border-border bg-muted/30">
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Your submitted benefit applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex-1">
                          <div className="font-semibold">{app.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {app.id}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{app.amount}</div>
                            <div className="text-sm text-muted-foreground">{app.date}</div>
                          </div>
                          <Badge variant={
                            app.status === "Approved" ? "default" : 
                            app.status === "In Progress" ? "secondary" : 
                            "outline"
                          }>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPermission("view_applications") && (
            <TabsContent value="applications" className="space-y-4">
              <Card className="shadow-card border-border/50">
                <CardHeader className="border-b border-border bg-muted/30">
                  <CardTitle>Applications to Review</CardTitle>
                  <CardDescription>Applications requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex-1">
                          <div className="font-semibold">{app.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {app.id}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{app.amount}</div>
                            <div className="text-sm text-muted-foreground">{app.date}</div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={
                              app.status === "Approved" ? "default" : 
                              app.status === "In Progress" ? "secondary" : 
                              "outline"
                            }>
                              {app.status}
                            </Badge>
                            {hasPermission("verify") && (
                              <Button size="sm" variant="outline">Verify</Button>
                            )}
                            {hasPermission("approve") && (
                              <Button size="sm">Approve</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPermission("view_payments") && (
            <TabsContent value="payments" className="space-y-4">
              <PaymentIntegration />
            </TabsContent>
          )}

          {hasPermission("handle_complaints") && (
            <TabsContent value="complaints" className="space-y-4">
              <GrievanceSystem />
            </TabsContent>
          )}

          {hasPermission("audit") && (
            <TabsContent value="audit" className="space-y-4">
              <AuditSystem />
            </TabsContent>
          )}

          {hasPermission("system_admin") && (
            <TabsContent value="system" className="space-y-4">
              <Card className="shadow-card border-border/50">
                <CardHeader className="border-b border-border bg-muted/30">
                  <CardTitle>System Administration</CardTitle>
                  <CardDescription>System monitoring and management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="w-12 h-12 mx-auto mb-4" />
                      <p>System administration tools will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="analytics" className="space-y-4">
            <Card className="shadow-card border-border/50">
              <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Key metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart className="w-12 h-12 mx-auto mb-4" />
                    <p>Analytics charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
