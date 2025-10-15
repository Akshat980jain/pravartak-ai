import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out",
    });
    navigate("/login");
  };

  // Mock data for beneficiary applications
  const applications = [
    {
      id: "APP-2025-00123",
      scheme: "PCR Victim Compensation",
      amount: "₹ 1,00,000",
      status: "Approved",
      submittedDate: "2025-01-10",
      approvedDate: "2025-01-14",
      disbursedDate: "2025-01-15"
    },
    {
      id: "APP-2025-00124",
      scheme: "PoA Atrocities Relief",
      amount: "₹ 75,000",
      status: "Under Review",
      submittedDate: "2025-01-12",
      approvedDate: null,
      disbursedDate: null
    },
    {
      id: "APP-2025-00125",
      scheme: "Inter-caste Marriage Incentive",
      amount: "₹ 2,50,000",
      status: "Pending",
      submittedDate: "2025-01-14",
      approvedDate: null,
      disbursedDate: null
    }
  ];

  const filteredApplications = applications.filter(app =>
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.scheme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Approved": "bg-green-100 text-green-800",
      "Under Review": "bg-yellow-100 text-yellow-800",
      "Pending": "bg-blue-100 text-blue-800",
      "Rejected": "bg-red-100 text-red-800"
    };
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Under Review": return <Clock className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Rejected": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
              <h1 className="text-2xl font-bold">Beneficiary Dashboard</h1>
              <p className="text-sm opacity-90">Welcome back • Aadhaar: {user.aadhaar}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white">
                Verified Beneficiary
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
            {/* Profile Summary */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Aadhaar Number</p>
                        <p className="font-medium">{user.aadhaar}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="font-medium text-lg">{applications.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Approved Applications</p>
                        <p className="font-medium text-lg">{applications.filter(app => app.status === 'Approved').length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">My Applications</CardTitle>
                    <CardDescription>Track the status of your submitted applications</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.scheme}</TableCell>
                        <TableCell className="font-semibold">{app.amount}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(app.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.submittedDate}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Applications</span>
                    <span className="font-semibold">{applications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="font-semibold text-green-600">{applications.filter(app => app.status === 'Approved').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Under Review</span>
                    <span className="font-semibold text-yellow-600">{applications.filter(app => app.status === 'Under Review').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-semibold text-blue-600">{applications.filter(app => app.status === 'Pending').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Application Approved</p>
                      <p className="text-xs text-gray-600">APP-2025-00123 • PCR Victim Compensation</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Application Under Review</p>
                      <p className="text-xs text-gray-600">APP-2025-00124 • PoA Atrocities Relief</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New Application Submitted</p>
                      <p className="text-xs text-gray-600">APP-2025-00125 • Inter-caste Marriage Incentive</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Guidelines
                  </Button>
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

export default BeneficiaryDashboard;
