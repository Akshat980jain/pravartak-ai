import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Bell,
  FileText,
  Map,
  Activity,
  TrendingUp,
  Users,
  Settings,
  Download,
  Eye,
  Plus,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getStatesList, getDistrictsList } from "@/lib/statesAndDistricts";
import IndiaMapLeaflet from "@/components/IndiaMapLeaflet";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    scheme: ""
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the dashboard",
    });
    navigate("/login");
  };

  // Mock data for charts
  const fundsData = [
    { month: "Jan", allocated: 50000000, disbursed: 45000000 },
    { month: "Feb", allocated: 55000000, disbursed: 52000000 },
    { month: "Mar", allocated: 60000000, disbursed: 48000000 },
    { month: "Apr", allocated: 65000000, disbursed: 61000000 },
    { month: "May", allocated: 70000000, disbursed: 55000000 },
    { month: "Jun", allocated: 75000000, disbursed: 67000000 }
  ];

  const pendingApprovals = [
    {
      state: "Uttar Pradesh",
      district: "Lucknow",
      pending: 2134,
      last24h: 412,
      status: "High"
    },
    {
      state: "Maharashtra",
      district: "Pune",
      pending: 1876,
      last24h: 298,
      status: "Medium"
    },
    {
      state: "Bihar",
      district: "Patna",
      pending: 1220,
      last24h: 184,
      status: "Medium"
    },
    {
      state: "Rajasthan",
      district: "Jaipur",
      pending: 1032,
      last24h: 152,
      status: "Low"
    }
  ];

  const apiHealth = [
    {
      service: "Aadhaar eKYC",
      success: "99.2%",
      latency: "420 ms",
      status: "OK"
    },
    {
      service: "DigiLocker",
      success: "97.8%",
      latency: "510 ms",
      status: "OK"
    },
    {
      service: "PFMS",
      success: "96.1%",
      latency: "640 ms",
      status: "Watch"
    },
    {
      service: "eCourts",
      success: "95.4%",
      latency: "780 ms",
      status: "Watch"
    },
    {
      service: "CCTNS",
      success: "93.8%",
      latency: "910 ms",
      status: "Issue"
    }
  ];

  const grievanceStats = {
    open: 12430,
    resolved: 102340,
    avgResolution: 3.8,
    escalations: {
      open: 1240,
      resolved: 8930
    },
    district: {
      open: 11190,
      resolved: 93410
    }
  };

  const auditLogs = [
    {
      date: "12 Oct 2025",
      time: "10:24",
      action: "Policy Updated",
      by: "Admin-01",
      status: "Info"
    },
    {
      date: "12 Oct 2025",
      time: "09:45",
      action: "Funds Batch Pushed to PFMS",
      by: "Admin-02",
      status: "Success"
    },
    {
      date: "12 Oct 2025",
      time: "08:30",
      action: "Officer Added (UP-Lucknow)",
      by: "Admin-03",
      status: "Info"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800",
      "OK": "bg-green-100 text-green-800",
      "Watch": "bg-yellow-100 text-yellow-800",
      "Issue": "bg-red-100 text-red-800",
      "Info": "bg-blue-100 text-blue-800",
      "Success": "bg-green-100 text-green-800"
    };
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800";
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
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Direct Benefit Transfer (DBT) - PCR / PoA Portal - Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Admin - Central / State Authority</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileText className="h-4 w-4 mr-2" />
                API Logs
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-blue-50 text-blue-700 border-blue-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters / फ़िल्टर</h2>
          <div className="flex items-center gap-4">
            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value, district: "" }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="State / राज्य" />
              </SelectTrigger>
              <SelectContent>
                {getStatesList().map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filters.district} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
              disabled={!filters.state}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={filters.state ? "District / जिला" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {filters.state && getDistrictsList(filters.state).map((district) => (
                  <SelectItem key={district} value={district.toLowerCase().replace(/\s+/g, "-")}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.scheme} onValueChange={(value) => setFilters(prev => ({ ...prev, scheme: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Scheme / योजना" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcr">PCR Victim Compensation</SelectItem>
                <SelectItem value="poa">PoA Atrocities Relief</SelectItem>
                <SelectItem value="marriage">Inter-caste Marriage</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Funds Allocated vs Disbursed */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Funds Allocated vs Disbursed (Real-time)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fundsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 10000000).toFixed(0)}Cr`} />
                      <Tooltip formatter={(value) => [`₹ ${(value as number / 10000000).toFixed(1)}Cr`, 'Amount']} />
                      <Line type="monotone" dataKey="allocated" stroke="#2a5367" strokeWidth={2} name="Allocated" />
                      <Line type="monotone" dataKey="disbursed" stroke="#10B981" strokeWidth={2} name="Disbursed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-500 mt-2">Data Source: PFMS, Updated every 5 minutes.</p>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Pending Approvals (by State / District)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{approval.state} / {approval.district}</div>
                          <div className="text-sm text-gray-600">
                            Pending: {approval.pending.toLocaleString()} • Last 24h: {approval.last24h}
                          </div>
                        </div>
                        <Badge className={getStatusBadge(approval.status)}>
                          {approval.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* State-wise Tagging */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">State-wise Tagging of DBT Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden border">
                  <IndiaMapLeaflet />
                </div>
              </CardContent>
            </Card>

            {/* API Health Status */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">API Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiHealth.map((api, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{api.service}</div>
                          <div className="text-sm text-gray-600">
                            Success: {api.success} • Avg Latency: {api.latency}
                          </div>
                        </div>
                        <Badge className={getStatusBadge(api.status)}>
                          {api.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Grievance Statistics */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Grievance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Open: {grievanceStats.open.toLocaleString()} • Resolved: {grievanceStats.resolved.toLocaleString()} • Avg Resolution: {grievanceStats.avgResolution} days
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Escalations (State Level)</div>
                      <div className="text-sm text-gray-600">
                        Open: {grievanceStats.escalations.open.toLocaleString()} • Resolved: {grievanceStats.escalations.resolved.toLocaleString()}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Attention</Badge>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">District Level</div>
                      <div className="text-sm text-gray-600">
                        Open: {grievanceStats.district.open.toLocaleString()} • Resolved: {grievanceStats.district.resolved.toLocaleString()}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Backlog</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trails */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Audit Trails / Data Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">{log.date} • {log.time}</div>
                        <div className="font-medium text-gray-900">{log.action}</div>
                        <div className="text-sm text-gray-600">By: {log.by}</div>
                      </div>
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Administration */}
        <Card className="bg-white mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Quick Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Reports Page</div>
                  <div className="text-sm text-gray-600">Download Scheme-wise fund flow, demographics, TAT reports (PDF/Excel)</div>
                  <div className="text-sm text-gray-500">Formats: PDF • Excel</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ready</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Open
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Scheme Management</div>
                  <div className="text-sm text-gray-600">Add, update, or modify existing schemes and their parameters</div>
                  <div className="text-sm text-gray-500">Actions: Add • Update</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Manage</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Open
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">User Management</div>
                  <div className="text-sm text-gray-600">Create, update, or deactivate user accounts and permissions</div>
                  <div className="text-sm text-gray-500">Actions: Create • Update</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Users</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Open
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Ministry of Social Justice & Empowerment, Govt. of India
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Helpdesk</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;