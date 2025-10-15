import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Eye,
  Check,
  X,
  Send,
  BarChart3,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [quickReply, setQuickReply] = useState("");

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the dashboard",
    });
    navigate("/login");
  };

  // Mock data for charts
  const disbursementData = [
    { month: "Jan", amount: 4500000 },
    { month: "Feb", amount: 5200000 },
    { month: "Mar", amount: 4800000 },
    { month: "Apr", amount: 6100000 },
    { month: "May", amount: 5500000 },
    { month: "Jun", amount: 6700000 }
  ];

  const schemeData = [
    { name: "PCR Victim Compensation", value: 45, color: "#2a5367" },
    { name: "PoA Atrocities Relief", value: 30, color: "#2a5367" },
    { name: "Inter-caste Marriage", value: 15, color: "#2a5367" },
    { name: "Other Schemes", value: 10, color: "#2a5367" }
  ];

  const recentApplications = [
    { 
      id: "DO-2025-00123", 
      beneficiary: "Ravi Kumar", 
      aadhaar: "XXXX-XXXX-1234",
      scheme: "PCR Victim Compensation", 
      amount: "₹ 1,00,000", 
      status: "Pending",
      statusIcon: <Clock className="h-4 w-4" />
    },
    { 
      id: "DO-2025-00124", 
      beneficiary: "Sunita Devi", 
      aadhaar: "XXXX-XXXX-5678",
      scheme: "PoA Atrocities Relief", 
      amount: "₹ 75,000", 
      status: "Verified",
      statusIcon: <CheckCircle className="h-4 w-4" />
    },
    { 
      id: "DO-2025-00125", 
      beneficiary: "Asha", 
      aadhaar: "XXXX-XXXX-9012",
      scheme: "Inter-caste Marriage Incentive", 
      amount: "₹ 2,50,000", 
      status: "Under Review",
      statusIcon: <Clock className="h-4 w-4" />
    }
  ];

  const grievances = [
    {
      id: "DO-2025-00110",
      from: "Meena",
      subject: "Delay in disbursement",
      received: "12 Oct 2025",
      priority: "High"
    },
    {
      id: "DO-2025-00111",
      from: "Arjun",
      subject: "Document re-upload",
      received: "11 Oct 2025",
      priority: "Medium"
    }
  ];

  const integrationStatus = [
    {
      service: "Aadhaar / eKYC",
      status: "Live",
      lastSync: "10:24 AM",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      service: "CCTNS / FIR",
      status: "Queue",
      lastSync: "10:18 AM",
      icon: <Clock className="h-4 w-4 text-orange-600" />
    },
    {
      service: "eCourts",
      status: "Live",
      lastSync: "10:20 AM",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      service: "PFMS / DBT",
      status: "Live",
      lastSync: "10:22 AM",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "Verified": return "text-green-600 bg-green-50";
      case "Under Review": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-white shadow-lg" style={{ backgroundColor: '#2a5367' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">District Officer Dashboard</h1>
              <p className="text-sm opacity-90">Welcome back, {user.username} • {user.district}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white">
                Secure • PFMS Integrated
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white hover:bg-white hover:text-gray-900">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Overview / अवलोकन</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold">8,542</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Verified</p>
                        <p className="text-2xl font-bold">5,120</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Funds Disbursed</p>
                        <p className="text-2xl font-bold">₹ 38.6 Cr</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Grievances</p>
                        <p className="text-2xl font-bold">143</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Applications */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Recent Applications / हाल ही में आवेदन</CardTitle>
                <CardDescription>Review and take action on incoming cases.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.beneficiary}</div>
                            <div className="text-sm text-gray-500">{app.aadhaar}</div>
                          </div>
                        </TableCell>
                        <TableCell>{app.scheme}</TableCell>
                        <TableCell className="font-semibold">{app.amount}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(app.status)} flex items-center gap-1 w-fit`}>
                            {app.statusIcon}
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {app.status === "Pending" || app.status === "Under Review" ? (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            ) : (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button size="sm" variant="destructive">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Use Integration Logs to cross-check Aadhaar/eCourts/CCTNS status.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grievances Section */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Grievances / शिकायतें</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grievances.map((grievance) => (
                    <div key={grievance.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-medium">Case ID: {grievance.id}</span>
                            <span className="text-sm text-gray-600">From: {grievance.from}</span>
                            <span className="text-sm text-gray-600">Received: {grievance.received}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{grievance.subject}</span>
                            <span className={`text-sm font-medium ${getPriorityColor(grievance.priority)}`}>
                              Priority: {grievance.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            View
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Reply
                          </Button>
                          <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Input
                    placeholder="Type a quick reply..."
                    value={quickReply}
                    onChange={(e) => setQuickReply(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Integration Status */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Integration Status / एकीकरण स्थिति</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationStatus.map((service) => (
                    <div key={service.service} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{service.service}</div>
                          <div className="text-sm text-gray-600">Last sync: {service.lastSync}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {service.icon}
                          <span className={`text-sm font-medium ${
                            service.status === "Live" ? "text-green-600" : "text-orange-600"
                          }`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Monitoring */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Fund Monitoring / फंड मॉनिटरिंग</CardTitle>
                <CardDescription>Disbursements by scheme and month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bar Chart */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Disbursement by Month
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={disbursementData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                          <Tooltip formatter={(value) => [`₹ ${(value as number / 100000).toFixed(1)}L`, 'Amount']} />
                          <Bar dataKey="amount" fill="#2a5367" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Scheme-wise Split
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Pie
                            data={schemeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {schemeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 space-y-1">
                      {schemeData.map((scheme) => (
                        <div key={scheme.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scheme.color }}></div>
                          <span>{scheme.name}: {scheme.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white py-4 mt-8" style={{ backgroundColor: '#2a5367' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>State DBT Cell: dbt.state@gov.in</span>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Accessibility</a>
            </div>
            <div>
              Ministry of Social Justice & Empowerment • Government of India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;