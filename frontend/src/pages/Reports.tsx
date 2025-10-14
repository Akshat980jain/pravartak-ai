import { Link } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, Users, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Reports = () => {
  const statsData = [
    {
      title: "Total Applications",
      value: "12,456",
      change: "+12.5%",
      icon: <FileText className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "Approved",
      value: "8,234",
      change: "+8.2%",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "Under Review",
      value: "2,145",
      change: "-3.1%",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-yellow-600"
    },
    {
      title: "Total Disbursed",
      value: "₹ 45.2 Cr",
      change: "+15.8%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-purple-600"
    }
  ];

  const recentApplications = [
    { id: "APP001", name: "Rajesh Kumar", type: "Education", status: "Approved", date: "2025-01-14", amount: "₹ 25,000" },
    { id: "APP002", name: "Priya Sharma", type: "Health", status: "Under Review", date: "2025-01-14", amount: "₹ 50,000" },
    { id: "APP003", name: "Amit Patel", type: "Housing", status: "Approved", date: "2025-01-13", amount: "₹ 1,00,000" },
    { id: "APP004", name: "Sunita Singh", type: "Pension", status: "Approved", date: "2025-01-13", amount: "₹ 15,000" },
    { id: "APP005", name: "Manoj Verma", type: "Agricultural", status: "Under Review", date: "2025-01-12", amount: "₹ 75,000" }
  ];

  const districtStats = [
    { district: "Mumbai", applications: 2543, approved: 1876, pending: 667, amount: "₹ 8.5 Cr" },
    { district: "Delhi", applications: 2134, approved: 1654, pending: 480, amount: "₹ 7.2 Cr" },
    { district: "Bangalore", applications: 1876, approved: 1432, pending: 444, amount: "₹ 6.8 Cr" },
    { district: "Chennai", applications: 1654, approved: 1234, pending: 420, amount: "₹ 5.9 Cr" },
    { district: "Ahmedabad", applications: 1432, approved: 1098, pending: 334, amount: "₹ 5.2 Cr" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Dashboard</h1>
              <p className="text-sm text-primary-foreground/90">Analytics and statistics</p>
            </div>
            <Button variant="secondary">
              <Download className="mr-2 h-5 w-5" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="districts">District Wise</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest submitted applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Benefit Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts">
            <Card>
              <CardHeader>
                <CardTitle>District-wise Statistics</CardTitle>
                <CardDescription>Application distribution across districts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>Total Applications</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Amount Disbursed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {districtStats.map((district) => (
                      <TableRow key={district.district}>
                        <TableCell className="font-medium">{district.district}</TableCell>
                        <TableCell>{district.applications}</TableCell>
                        <TableCell className="text-green-600">{district.approved}</TableCell>
                        <TableCell className="text-yellow-600">{district.pending}</TableCell>
                        <TableCell className="font-semibold">{district.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Rate</CardTitle>
                  <CardDescription>Monthly approval trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">January 2025</span>
                        <span className="text-sm font-semibold">68%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">December 2024</span>
                        <span className="text-sm font-semibold">72%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">November 2024</span>
                        <span className="text-sm font-semibold">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefit Distribution</CardTitle>
                  <CardDescription>Applications by benefit type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Education", count: 3245, color: "bg-blue-500" },
                      { type: "Health", count: 2876, color: "bg-green-500" },
                      { type: "Housing", count: 2134, color: "bg-purple-500" },
                      { type: "Pension", count: 1987, color: "bg-orange-500" },
                      { type: "Agricultural", count: 1654, color: "bg-yellow-500" }
                    ].map((benefit) => (
                      <div key={benefit.type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{benefit.type}</span>
                          <span className="text-sm font-semibold">{benefit.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`${benefit.color} h-2 rounded-full`} style={{ width: `${(benefit.count / 3245) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
