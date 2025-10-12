import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, FileText, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const recentApplications = [
    { id: "DBT2025001234", name: "Rajesh Kumar", status: "In Progress", date: "15 Jan 2025", amount: "₹50,000" },
    { id: "DBT2025001235", name: "Meera Devi", status: "Approved", date: "14 Jan 2025", amount: "₹75,000" },
    { id: "DBT2025001236", name: "Suresh Yadav", status: "Under Review", date: "13 Jan 2025", amount: "₹60,000" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage DBT applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">68.7% approval rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Disbursed</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹4.2Cr</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card className="shadow-card border-border/50">
              <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest benefit applications submitted</CardDescription>
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
