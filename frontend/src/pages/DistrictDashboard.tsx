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
  PieChart,
  ExternalLink,
  Upload,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const DistrictDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [quickReply, setQuickReply] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the dashboard",
    });
    navigate("/login");
  };

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleVerifyApplication = (applicationId: string) => {
    setRecentApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: "Verified", 
              statusIcon: <CheckCircle className="h-4 w-4" />,
              officerRemarks: "Application verified and approved by officer."
            }
          : app
      )
    );
    toast({
      title: "Application Verified",
      description: "The application has been verified and approved.",
    });
    setIsModalOpen(false);
  };

  const handleRejectApplication = (applicationId: string) => {
    setRecentApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: "Rejected", 
              statusIcon: <X className="h-4 w-4" />,
              officerRemarks: "Application rejected due to insufficient documentation."
            }
          : app
      )
    );
    toast({
      title: "Application Rejected",
      description: "The application has been rejected.",
    });
    setIsModalOpen(false);
  };

  const handleUnderReviewApplication = (applicationId: string) => {
    setRecentApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: "Under Review", 
              statusIcon: <Clock className="h-4 w-4" />,
              officerRemarks: "Application is under review for additional verification."
            }
          : app
      )
    );
    toast({
      title: "Application Under Review",
      description: "The application has been marked for additional review.",
    });
    setIsModalOpen(false);
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
    { name: "PCR Victim Compensation", value: 45, color: "#3b82f6" },
    { name: "PoA Atrocities Relief", value: 30, color: "#10b981" },
    { name: "Inter-caste Marriage", value: 15, color: "#f59e0b" },
    { name: "Other Schemes", value: 10, color: "#ef4444" }
  ];

  const [recentApplications, setRecentApplications] = useState([
    { 
      id: "DBT-PCR-X2LJBHK9", 
      beneficiary: "Ravi Kumar", 
      aadhaar: "XXXX-XXXX-1234",
      scheme: "PoA Immediate relief compensation", 
      amount: "₹ 1,00,000", 
      status: "Pending",
      statusIcon: <Clock className="h-4 w-4" />,
      district: "Lucknow",
      submissionDate: "10 Oct 2025",
      firNumber: "FIR/UP/2025/09121",
      ecourtCase: "2025/CR/1982",
      bankAccount: "1234567890",
      ifsc: "SBIN0000123",
      bankName: "State Bank of India",
      officerRemarks: "All documents verified, proceed for sanction.",
      activityTimeline: [
        { date: "12 Oct 2025 • 10:24", action: "Aadhaar eKYC matched", status: "completed" },
        { date: "12 Oct 2025 • 09:10", action: "FIR reference pulled from CCTNS", status: "completed" },
        { date: "11 Oct 2025 • 16:05", action: "Documents uploaded by applicant", status: "completed" },
        { date: "10 Oct 2025 • 12:40", action: "Application submitted", status: "completed" }
      ]
    },
    { 
      id: "DO-2025-00124", 
      beneficiary: "Sunita Devi", 
      aadhaar: "XXXX-XXXX-5678",
      scheme: "PoA Atrocities Relief", 
      amount: "₹ 75,000", 
      status: "Verified",
      statusIcon: <CheckCircle className="h-4 w-4" />,
      district: "Kanpur",
      submissionDate: "08 Oct 2025",
      firNumber: "FIR/UP/2025/08945",
      ecourtCase: "2025/CR/1956",
      bankAccount: "9876543210",
      ifsc: "HDFC0000123",
      bankName: "HDFC Bank",
      officerRemarks: "Application approved after verification.",
      activityTimeline: [
        { date: "10 Oct 2025 • 14:30", action: "Application verified and approved", status: "completed" },
        { date: "09 Oct 2025 • 11:15", action: "Aadhaar eKYC matched", status: "completed" },
        { date: "08 Oct 2025 • 16:20", action: "Application submitted", status: "completed" }
      ]
    },
    { 
      id: "DO-2025-00125", 
      beneficiary: "Asha", 
      aadhaar: "XXXX-XXXX-9012",
      scheme: "Inter-caste Marriage Incentive", 
      amount: "₹ 2,50,000", 
      status: "Under Review",
      statusIcon: <Clock className="h-4 w-4" />,
      district: "Agra",
      submissionDate: "09 Oct 2025",
      firNumber: "FIR/UP/2025/09012",
      ecourtCase: "2025/CR/1989",
      bankAccount: "5555666677",
      ifsc: "ICIC0000123",
      bankName: "ICICI Bank",
      officerRemarks: "Under review for additional documentation.",
      activityTimeline: [
        { date: "11 Oct 2025 • 09:45", action: "Additional documents requested", status: "pending" },
        { date: "10 Oct 2025 • 15:20", action: "Initial verification completed", status: "completed" },
        { date: "09 Oct 2025 • 13:10", action: "Application submitted", status: "completed" }
      ]
    }
  ]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Approved": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Rejected": "bg-red-100 text-red-800",
      "Open": "bg-orange-100 text-orange-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Resolved": "bg-green-100 text-green-800",
      "Verified": "bg-green-100 text-green-800",
      "Under Review": "bg-blue-100 text-blue-800"
    };
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800"
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || "bg-gray-100 text-gray-800";
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
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700">
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
                          <Badge className={`${getStatusBadge(app.status)} flex items-center gap-1 w-fit`}>
                            {app.statusIcon}
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleViewApplication(app)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {app.status === "Pending" || app.status === "Under Review" ? (
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                onClick={() => handleVerifyApplication(app.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Verify
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                onClick={() => handleVerifyApplication(app.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleRejectApplication(app.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
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
                            <span className={`text-sm font-medium ${getPriorityBadge(grievance.priority)}`}>
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

      {/* Application Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">#{selectedApplication.id}</h2>
                  <p className="text-gray-600">{selectedApplication.beneficiary} • {selectedApplication.scheme}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusBadge(selectedApplication.status)} flex items-center gap-1`}>
                    {selectedApplication.statusIcon}
                    {selectedApplication.status}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    eKYC Matched
                  </Badge>
                </div>
              </div>

              {/* Applicant & Case Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applicant & Case Information / आवेदक व मामला विवरण</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Beneficiary / लाभार्थी</p>
                    <p className="font-medium">{selectedApplication.beneficiary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar / आधार</p>
                    <p className="font-medium">{selectedApplication.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheme / योजना</p>
                    <p className="font-medium">{selectedApplication.scheme}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested Amount / राशि</p>
                    <p className="font-medium">{selectedApplication.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">District</p>
                    <p className="font-medium">{selectedApplication.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submission Date</p>
                    <p className="font-medium">{selectedApplication.submissionDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Links / प्रमाणीकरण लिंक</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Aadhaar eKYC Snapshot</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">FIR (CCTNS) - Ref: {selectedApplication.firNumber}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">eCourts Case - {selectedApplication.ecourtCase}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Uploaded Proofs (ID, Affidavit, Bank Passbook)</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bank & PFMS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bank & PFMS / बैंक और पीएफएमएस</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Account Validation</p>
                    <p className="font-medium">Validated via PFMS • IFSC: {selectedApplication.ifsc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Beneficiary Bank</p>
                    <p className="font-medium">{selectedApplication.bankName}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Timeline / प्रगति</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApplication.activityTimeline.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Officer Remarks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Officer Remarks / अधिकारी टिप्पणी</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedApplication.officerRemarks}</p>
                </CardContent>
              </Card>

              {/* Sanction Summary */}
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Sanction Summary / स्वीकृति सार</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Eligible Amount</p>
                      <p className="font-bold text-lg">{selectedApplication.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verification Status</p>
                      <p className="font-medium">Ready for Approval</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Disbursement Mode</p>
                    <p className="font-medium">PFMS • DBT</p>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Clicking Verify & Approve will initiate PFMS/DBT request.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                {selectedApplication.status === "Pending" || selectedApplication.status === "Under Review" ? (
                  <>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleUnderReviewApplication(selectedApplication.id)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerifyApplication(selectedApplication.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Verify & Approve
                    </Button>
                  </>
                ) : selectedApplication.status === "Verified" ? (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleVerifyApplication(selectedApplication.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                ) : null}
                <Button 
                  variant="destructive"
                  onClick={() => handleRejectApplication(selectedApplication.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

export default DistrictDashboard;